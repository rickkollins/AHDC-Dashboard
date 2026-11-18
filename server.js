/**
 * AHDC Engagements Dashboard — self-hosted server.
 *
 * Everything lives in one small Express app:
 *  - Admin dashboard (password-protected session) — GET/PUT /api/data
 *  - Public per-engagement upload portal — GET/POST /portal/:token
 *  - Admin-only file listing/download for uploaded documents
 *
 * Data is stored as a single JSON file (data/data.json), matching the
 * shape the dashboard already used when it lived on Claude Artifacts —
 * this keeps the frontend port nearly 1:1. Uploaded files live on disk
 * under uploads/<engagementId>/.
 */
'use strict';
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = parseInt(process.env.PORT, 10) || 3000;

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const MAX_UPLOAD_MB = parseInt(process.env.MAX_UPLOAD_MB, 10) || 25;
const MAX_FILES_PER_UPLOAD = parseInt(process.env.MAX_FILES_PER_UPLOAD, 10) || 10;

if (!ADMIN_PASSWORD_HASH) {
  console.error('FATAL: ADMIN_PASSWORD_HASH is not set. See .env.example — generate one with:');
  console.error('  node scripts/hash-password.js "your password"');
  process.exit(1);
}
if (!SESSION_SECRET) {
  console.error('FATAL: SESSION_SECRET is not set. Put a long random string in .env (see .env.example).');
  process.exit(1);
}

for (const dir of [DATA_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ============================= DATA STORE ============================= */
/** A tiny single-writer queue so concurrent requests never interleave writes to data.json. */
let writeChain = Promise.resolve();

function defaultData() {
  return { clients: [], engagements: [], actionItems: [] };
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) return defaultData();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      clients: Array.isArray(parsed.clients) ? parsed.clients : [],
      engagements: Array.isArray(parsed.engagements) ? parsed.engagements : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : []
    };
  } catch (err) {
    console.error('Failed to read data.json, backing it up and starting fresh:', err.message);
    try { fs.copyFileSync(DATA_FILE, DATA_FILE + '.corrupt-' + Date.now()); } catch (_) {}
    return defaultData();
  }
}

/** Atomic write: write to a temp file then rename, so a crash mid-write never corrupts data.json. */
function writeDataAtomic(data) {
  writeChain = writeChain.then(() => new Promise((resolve, reject) => {
    const tmp = DATA_FILE + '.tmp-' + process.pid + '-' + Date.now();
    fs.writeFile(tmp, JSON.stringify(data, null, 2), (err) => {
      if (err) return reject(err);
      fs.rename(tmp, DATA_FILE, (err2) => err2 ? reject(err2) : resolve());
    });
  }));
  return writeChain;
}

function ensurePortalToken(eng) {
  if (!eng.portalToken) eng.portalToken = crypto.randomBytes(18).toString('base64url');
  if (!Array.isArray(eng.portalFiles)) eng.portalFiles = [];
  return eng;
}

/* ============================= APP SETUP ============================= */
const app = express();
app.set('trust proxy', 1); // behind nginx
app.use(helmet({ contentSecurityPolicy: false })); // dashboard has inline styles/scripts; CSP tightened at the nginx layer if desired
app.use(express.json({ limit: '8mb' }));
app.use(session({
  secret: SESSION_SECRET,
  name: 'ahdc.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE !== 'false', // set COOKIE_SECURE=false only for local http testing
    maxAge: 1000 * 60 * 60 * 24 * 14
  }
}));

function authRequired(req, res, next) {
  if (req.session && req.session.authed) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'not_authenticated' });
  return res.redirect('/login');
}

/* ============================= AUTH ============================= */
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

app.post('/api/login', loginLimiter, express.json(), async (req, res) => {
  const password = (req.body && req.body.password) || '';
  const ok = password && await bcrypt.compare(password, ADMIN_PASSWORD_HASH).catch(() => false);
  if (!ok) return res.status(401).json({ error: 'invalid_password' });
  req.session.authed = true;
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/login', (req, res) => {
  if (req.session && req.session.authed) return res.redirect('/');
  res.sendFile(path.join(PUBLIC_DIR, 'login.html'));
});

/* ============================= ADMIN DATA API ============================= */
app.get('/api/data', authRequired, async (req, res) => {
  const data = readData();
  let changed = false;
  data.engagements.forEach(eng => {
    const before = eng.portalToken;
    ensurePortalToken(eng);
    if (eng.portalToken !== before) changed = true;
  });
  // Any engagement that just got a fresh token (new, or migrated from the
  // Claude Artifacts version) needs that token written to disk immediately —
  // otherwise the link the admin sees here would never match what the
  // public /portal/:token lookup reads back from disk.
  if (changed) {
    try { await writeDataAtomic(data); } catch (err) { console.error('Failed to persist new portal tokens:', err); }
  }
  res.json(data);
});

app.put('/api/data', authRequired, async (req, res) => {
  const body = req.body;
  if (!body || !Array.isArray(body.clients) || !Array.isArray(body.engagements) || !Array.isArray(body.actionItems)) {
    return res.status(400).json({ error: 'invalid_body' });
  }
  // Preserve server-controlled fields (portal token + uploaded file records) —
  // the dashboard's edit forms don't send these, so merge them back in from
  // the current record rather than letting a save wipe them out.
  const current = readData();
  const byId = {};
  current.engagements.forEach(e => { byId[e.id] = e; });
  body.engagements.forEach(e => {
    const prev = byId[e.id];
    if (prev) {
      e.portalToken = prev.portalToken;
      e.portalFiles = prev.portalFiles || [];
    }
    ensurePortalToken(e);
  });
  try {
    await writeDataAtomic(body);
    res.json({ ok: true });
  } catch (err) {
    console.error('Write failed:', err);
    res.status(500).json({ error: 'write_failed' });
  }
});

app.post('/api/engagements/:id/regenerate-portal-token', authRequired, async (req, res) => {
  const data = readData();
  const eng = data.engagements.find(e => e.id === req.params.id);
  if (!eng) return res.status(404).json({ error: 'not_found' });
  eng.portalToken = crypto.randomBytes(18).toString('base64url');
  await writeDataAtomic(data);
  res.json({ ok: true, portalToken: eng.portalToken });
});

app.post('/api/engagements/:id/clear-new-docs', authRequired, async (req, res) => {
  const data = readData();
  const eng = data.engagements.find(e => e.id === req.params.id);
  if (!eng) return res.status(404).json({ error: 'not_found' });
  eng.newDocsAt = null;
  await writeDataAtomic(data);
  res.json({ ok: true });
});

app.post('/api/engagements/:id/files/:fileId/reviewed', authRequired, async (req, res) => {
  const data = readData();
  const eng = data.engagements.find(e => e.id === req.params.id);
  const file = eng && (eng.portalFiles || []).find(f => f.id === req.params.fileId);
  if (!eng || !file) return res.status(404).json({ error: 'not_found' });
  file.reviewed = !!(req.body && req.body.reviewed);
  await writeDataAtomic(data);
  res.json({ ok: true, reviewed: file.reviewed });
});

app.get('/api/download/:engId/:fileId', authRequired, (req, res) => {
  const data = readData();
  const eng = data.engagements.find(e => e.id === req.params.engId);
  const file = eng && (eng.portalFiles || []).find(f => f.id === req.params.fileId);
  if (!eng || !file) return res.status(404).send('File not found.');
  const filePath = path.join(UPLOADS_DIR, eng.id, file.storedName);
  if (!filePath.startsWith(path.join(UPLOADS_DIR, eng.id))) return res.status(400).send('Bad path.');
  res.download(filePath, file.originalName, (err) => {
    if (err && !res.headersSent) res.status(404).send('File not found on disk.');
  });
});

/* ============================= PUBLIC UPLOAD PORTAL ============================= */
const BLOCKED_EXTENSIONS = new Set(['.exe', '.bat', '.cmd', '.sh', '.msi', '.com', '.scr', '.js', '.vbs', '.ps1', '.jar', '.app']);

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(UPLOADS_DIR, req.portalEngagement.id);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const safeBase = crypto.randomBytes(8).toString('hex');
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, safeBase + ext);
    }
  }),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024, files: MAX_FILES_PER_UPLOAD },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (BLOCKED_EXTENSIONS.has(ext)) return cb(new Error('file_type_not_allowed'));
    cb(null, true);
  }
});

const portalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false });

function loadPortalEngagement(req, res, next) {
  const data = readData();
  const eng = data.engagements.find(e => e.portalToken === req.params.token);
  if (!eng) return res.status(404).send('This upload link is invalid or has been reset. Please ask for a new one.');
  const client = data.clients.find(c => c.id === eng.clientId);
  req.portalEngagement = eng;
  req.portalClient = client;
  next();
}

app.get('/portal/:token', portalLimiter, loadPortalEngagement, (req, res) => {
  const html = fs.readFileSync(path.join(PUBLIC_DIR, 'portal.html'), 'utf8')
    .replace(/__ENGAGEMENT_TITLE__/g, escapeHtml(req.portalEngagement.title || 'this engagement'))
    .replace(/__CLIENT_NAME__/g, escapeHtml(req.portalClient ? req.portalClient.name : ''));
  res.send(html);
});

app.post('/portal/:token/upload', portalLimiter, loadPortalEngagement, (req, res) => {
  upload.array('files', MAX_FILES_PER_UPLOAD)(req, res, async (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? `Each file must be under ${MAX_UPLOAD_MB}MB.`
        : err.message === 'file_type_not_allowed' ? 'That file type is not accepted.'
        : 'Upload failed.';
      return res.status(400).json({ error: msg });
    }
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: 'No files received.' });

    const data = readData();
    const eng = data.engagements.find(e => e.id === req.portalEngagement.id);
    if (!eng) return res.status(404).json({ error: 'Engagement no longer exists.' });
    ensurePortalToken(eng);
    const note = (req.body && req.body.note ? String(req.body.note) : '').slice(0, 500);
    files.forEach(f => {
      eng.portalFiles.push({
        id: crypto.randomBytes(10).toString('hex'),
        originalName: f.originalname,
        storedName: f.filename,
        size: f.size,
        uploadedAt: new Date().toISOString(),
        note,
        reviewed: false
      });
    });
    eng.newDocsAt = new Date().toISOString();
    await writeDataAtomic(data);
    res.json({ ok: true, count: files.length });
  });
});

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ============================= DASHBOARD (admin only) ============================= */
app.get('/', authRequired, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});
app.get('/app.js', authRequired, (req, res) => {
  res.type('application/javascript').sendFile(path.join(PUBLIC_DIR, 'app.js'));
});
app.use('/assets', authRequired, express.static(path.join(PUBLIC_DIR, 'assets')));

app.use((req, res) => res.status(404).send('Not found.'));

app.listen(PORT, () => {
  console.log(`AHDC dashboard server listening on port ${PORT}`);
});
