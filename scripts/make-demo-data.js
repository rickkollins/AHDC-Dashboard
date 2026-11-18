#!/usr/bin/env node
/**
 * Generates a fictional demo dataset for trying out the dashboard locally
 * (and for the screenshots in docs/). Every company, person, email address
 * and phone number here is made up.
 *
 * Dates are generated relative to today, so the timeline, "today" line,
 * Morning Roundup and KPIs always look realistic.
 *
 * Usage (run from the project folder):
 *   node scripts/make-demo-data.js            # writes data/data.json + sample uploads
 *   node scripts/make-demo-data.js --force    # overwrite an existing data/data.json
 *
 * WARNING: never run this on the live server — it replaces data/data.json.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'data.json');
const UPLOADS_DIR = path.join(ROOT, 'uploads');

if (fs.existsSync(DATA_FILE) && !process.argv.includes('--force')) {
  console.error('data/data.json already exists. Re-run with --force to overwrite it (this deletes that data).');
  process.exit(1);
}

const today = new Date(); today.setHours(0, 0, 0, 0);
const d = (n) => { const x = new Date(today); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const ts = (n, h = 10) => { const x = new Date(today); x.setDate(x.getDate() + n); x.setHours(h, 15, 0, 0); return x.toISOString(); };
let seq = 0;
const id = (p) => p + '_demo' + (++seq).toString(36).padStart(3, '0');
const token = () => crypto.randomBytes(18).toString('base64url');

const clients = [
  { name: 'Northwind Health Partners', industry: 'Healthcare', status: 'Active',
    notes: 'Regional clinic network, 14 locations. Board meets the first Tuesday of each month.',
    filesUrl: 'https://example.sharepoint.com/sites/Clients/Northwind',
    contacts: [['Dana Whitfield', 'COO', 'dana.whitfield@example.com', '555-0101'], ['Marcus Lee', 'IT Director', 'marcus.lee@example.com', '555-0102']] },
  { name: 'Bluebird Logistics', industry: 'Transportation', status: 'Active',
    notes: 'Prefers calls over email. Fiscal year ends in June.',
    filesUrl: 'https://example.sharepoint.com/sites/Clients/Bluebird',
    contacts: [['Priya Raman', 'VP Operations', 'priya.raman@example.com', '555-0110']] },
  { name: 'Cedar Ridge Manufacturing', industry: 'Manufacturing', status: 'Active',
    notes: 'Two plants. Plant 2 runs a different ERP version.',
    filesUrl: '',
    contacts: [['Tom Alvarez', 'Plant Manager', 'tom.alvarez@example.com', '555-0120'], ['Jill Park', 'Controller', 'jill.park@example.com', '555-0121']] },
  { name: 'Harbor Credit Union', industry: 'Financial services', status: 'Active',
    notes: 'Regulated — keep all documents in the SharePoint library, never email attachments.',
    filesUrl: 'https://example.sharepoint.com/sites/Clients/Harbor',
    contacts: [['Elena Brooks', 'Chief Risk Officer', 'elena.brooks@example.com', '555-0130']] },
  { name: 'Summit Outdoor Co.', industry: 'Retail', status: 'Prospect',
    notes: 'Met at the spring trade show. Proposal under review.',
    filesUrl: '',
    contacts: [['Ray Okafor', 'Founder', 'ray.okafor@example.com', '555-0140']] },
  { name: 'Lakeside School District', industry: 'Education', status: 'On Hold',
    notes: 'Paused until the new budget is approved.',
    filesUrl: '',
    contacts: [['Karen Mills', 'Superintendent', 'karen.mills@example.com', '555-0150']] }
].map(c => ({
  id: id('c'), name: c.name, industry: c.industry, status: c.status, notes: c.notes, filesUrl: c.filesUrl,
  contacts: c.contacts.map((ct, i) => ({ id: id('ct'), name: ct[0], title: ct[1], email: ct[2], phone: ct[3], primary: i === 0 }))
}));
const C = Object.fromEntries(clients.map(c => [c.name.split(' ')[0], c.id]));

const ms = (name, off, done) => ({ id: id('m'), name, date: d(off), done: !!done });
const link = (label, url) => ({ id: id('lnk'), label, url });
const cf = (key, value) => ({ id: id('cf'), key, value });

const engagements = [
  { clientId: C.Northwind, title: 'EHR Migration — Phase 2', type: 'Implementation', owner: 'Sarah Chen',
    start: d(-95), end: d(60), status: 'on-track', progress: 55,
    milestones: [ms('Data mapping sign-off', -60, true), ms('Pilot clinic go-live', -10, true), ms('Remaining clinics go-live', 25), ms('Post-launch review', 55)],
    links: [link('Project folder', 'https://example.sharepoint.com/sites/Clients/Northwind/EHR'), link('Kickoff notes', 'https://www.onenote.com/example/kickoff')],
    customFields: [cf('PO number', 'PO-48213'), cf('Contract #', 'NW-2026-07')],
    notes: 'Pilot went smoothly. Watch the lab-results interface at clinics 9–14.',
    files: [['Signed SOW - Phase 2.pdf', -1, false], ['Clinic go-live checklist.xlsx', 0, false]] },
  { clientId: C.Northwind, title: 'HIPAA Security Assessment', type: 'Audit & Compliance', owner: 'Mike Torres',
    start: d(-40), end: d(9), status: 'at-risk', progress: 70,
    milestones: [ms('Interviews complete', -20, true), ms('Draft findings', -3), ms('Final report', 8)],
    links: [link('Evidence folder', 'https://example.sharepoint.com/sites/Clients/Northwind/HIPAA')],
    customFields: [cf('Contract #', 'NW-2026-11')],
    notes: 'Waiting on network diagrams from the client IT team.',
    files: [['Network diagram v3.pdf', -2, false], ['Access review export.csv', -5, true]] },
  { clientId: C.Bluebird, title: 'Fleet Routing Optimization', type: 'Advisory', owner: 'Sarah Chen',
    start: d(-30), end: d(120), status: 'on-track', progress: 25,
    milestones: [ms('Current-state analysis', -5, true), ms('Routing model prototype', 30), ms('Pilot on two depots', 75)],
    links: [link('Shared drive', 'https://example-my.sharepoint.com/personal/bluebird')],
    customFields: [], notes: '', files: [] },
  { clientId: C.Bluebird, title: 'Warehouse WMS Rollout', type: 'Implementation', owner: 'James Patel',
    start: d(-120), end: d(-4), status: 'delayed', progress: 85,
    milestones: [ms('Vendor selection', -100, true), ms('Configuration', -45, true), ms('Staff training', -12), ms('Cutover', -4)],
    links: [], customFields: [cf('Vendor', 'Acme WMS')],
    notes: 'Cutover slipped — hardware delivery delayed. New date pending.',
    files: [['Training attendance.xlsx', -3, false]] },
  { clientId: C.Cedar, title: 'ERP Upgrade — Plant 1', type: 'Implementation', owner: 'Mike Torres',
    start: d(-60), end: d(150), status: 'on-track', progress: 30,
    milestones: [ms('Fit-gap workshop', -30, true), ms('Test environment ready', 0), ms('User acceptance testing', 90)],
    links: [link('Contracts', 'https://example.sharepoint.com/sites/Clients/Cedar/Contracts')],
    customFields: [cf('PO number', 'PO-51007')], notes: '', files: [] },
  { clientId: C.Cedar, title: 'Cost Accounting Review', type: 'Advisory', owner: 'Ana Ruiz',
    start: d(-150), end: d(-20), status: 'complete', progress: 100,
    milestones: [ms('Findings presented', -25, true)],
    links: [], customFields: [], notes: 'Delivered. Client may extend to Plant 2 next year.', files: [] },
  { clientId: C.Harbor, title: 'Vendor Risk Program', type: 'Audit & Compliance', owner: 'Ana Ruiz',
    start: d(-20), end: d(85), status: 'on-track', progress: 15,
    milestones: [ms('Vendor inventory', 10), ms('Risk tiering', 40), ms('Board presentation', 80)],
    links: [link('Evidence library', 'https://example.sharepoint.com/sites/Clients/Harbor/VRM')],
    customFields: [cf('Exam date', 'Q2 next year')], notes: '',
    files: [['Vendor list 2026.xlsx', 0, false]] },
  { clientId: C.Harbor, title: 'Help Desk Support Retainer', type: 'Support & Maintenance', owner: 'James Patel',
    start: d(-200), end: d(165), status: 'on-track', progress: 60,
    milestones: [ms('Quarterly check-in', 12)],
    links: [], customFields: [cf('Hours / month', '20')], notes: '', files: [] },
  { clientId: C.Summit, title: 'E-commerce Strategy', type: 'Strategy', owner: 'Sarah Chen',
    start: d(14), end: d(100), status: 'not-started', progress: 0,
    milestones: [ms('Discovery workshop', 20), ms('Recommendations', 80)],
    links: [], customFields: [], notes: 'Starts once the proposal is signed.', files: [] }
];

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
ensureDir(path.dirname(DATA_FILE));
ensureDir(UPLOADS_DIR);

const finalEngs = engagements.map(e => {
  const engId = id('e');
  const portalFiles = e.files.map(([name, off, reviewed]) => {
    const storedName = crypto.randomBytes(8).toString('hex') + path.extname(name).toLowerCase();
    ensureDir(path.join(UPLOADS_DIR, engId));
    fs.writeFileSync(path.join(UPLOADS_DIR, engId, storedName), 'Demo file: ' + name + '\n');
    return { id: crypto.randomBytes(10).toString('hex'), originalName: name, storedName,
      size: 40000 + Math.floor(Math.random() * 900000), uploadedAt: ts(off, 9 + (seq % 8)), note: '', reviewed };
  });
  const hasNew = portalFiles.some(f => !f.reviewed);
  const out = { id: engId, clientId: e.clientId, title: e.title, type: e.type, owner: e.owner, start: e.start, end: e.end,
    status: e.status, progress: e.progress, milestones: e.milestones, links: e.links, customFields: e.customFields,
    notes: e.notes, portalToken: token(), portalFiles,
    newDocsAt: hasNew ? portalFiles.filter(f => !f.reviewed).map(f => f.uploadedAt).sort().pop() : null };
  return out;
});

const actionItems = [
  { type: 'call', title: 'Call Priya re: cutover date', clientId: C.Bluebird, date: d(-1) },
  { type: 'meeting', title: 'Weekly status — Northwind', clientId: C.Northwind, date: d(0) },
  { type: 'email', title: 'Send revised proposal', clientId: C.Summit, date: d(0) },
  { type: 'trip', title: 'Site visit — Cedar Ridge Plant 1', clientId: C.Cedar, date: d(6) }
].map(a => ({ id: id('a'), type: a.type, title: a.title, clientId: a.clientId, date: a.date, done: false, notes: '' }));

fs.writeFileSync(DATA_FILE, JSON.stringify({ clients, engagements: finalEngs, actionItems }, null, 2));
console.log(`Wrote demo data: ${clients.length} clients, ${finalEngs.length} engagements, ${actionItems.length} action items -> data/data.json`);
