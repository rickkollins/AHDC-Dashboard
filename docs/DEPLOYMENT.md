# Deployment & server administration

How the dashboard runs on a Linux VPS (the AHDC install is a Hostinger VPS running Ubuntu 24.04, serving **https://3dprintingnews.fun**), and how to update, back up and troubleshoot it.

Commands marked **(on the VPS)** go in the server's terminal: hPanel → VPS → **Web console**, or `ssh root@YOUR-VPS-IP` from your computer's Terminal. Commands marked **(on your computer)** go in Terminal on your Mac.

---

## How it's put together

```
Browser ──HTTPS──▶ nginx (port 443, Let's Encrypt certificate)
                     │  proxies to
                     ▼
              Node.js app (server.js, port 3000)  ← systemd service "ahdc-dashboard"
                     │
                     ├── data/data.json      all clients, engagements, milestones, to-dos
                     └── uploads/<engId>/    files clients sent through the portal
```

- The app lives in **`/root/ahdc-dashboard`** on the AHDC VPS.
- Settings and secrets live in **`.env`** in that folder (never committed to Git — see `.env.example`).
- `data/` and `uploads/` hold real client information and are also never committed.

## First-time install (summary)

**(on the VPS)**

```bash
# 1. Node.js 20+ and nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs nginx

# 2. Get the code
cd /root
git clone https://github.com/rickkollins/AHDC-Dashboard.git ahdc-dashboard
cd ahdc-dashboard
npm install --omit=dev

# 3. Settings
cp .env.example .env
node scripts/hash-password.js "choose a strong team password"   # copy the ADMIN_PASSWORD_HASH=... line it prints
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # copy this for SESSION_SECRET
nano .env   # paste both values in; leave COOKIE_SECURE unset in production
```

**4. Run it as a service** — create `/etc/systemd/system/ahdc-dashboard.service`:

```ini
[Unit]
Description=AHDC Engagements Dashboard
After=network.target

[Service]
WorkingDirectory=/root/ahdc-dashboard
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now ahdc-dashboard
systemctl status ahdc-dashboard
```

**5. nginx + HTTPS** — point the domain's DNS **A record** (`@`, and optionally `www`) at the VPS IP, then create `/etc/nginx/sites-available/ahdc`:

```nginx
server {
    server_name 3dprintingnews.fun www.3dprintingnews.fun;
    client_max_body_size 260M;   # allows 10 files x 25 MB in one upload
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/ahdc /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d 3dprintingnews.fun -d www.3dprintingnews.fun
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

## Updating to the latest code from GitHub

**(on the VPS)**

```bash
cd /root/ahdc-dashboard
cp -a data "data.before-update-$(date +%F)"      # safety copy of the data
git pull                                         # first time only: see note below
npm install --omit=dev
systemctl restart ahdc-dashboard
systemctl status ahdc-dashboard --no-pager
```

> **Note:** the current AHDC server folder was installed from a zip file, not with `git clone`, so `git pull` won't work there yet. To switch it over once: `cd /root/ahdc-dashboard && git init && git remote add origin https://github.com/rickkollins/AHDC-Dashboard.git && git fetch origin && git reset --mixed origin/main`, then check `git status` shows no changes to `server.js`/`public/`. `data/`, `uploads/` and `.env` are ignored and won't be touched.

## Changing the team password

**(on the VPS)**

```bash
cd /root/ahdc-dashboard
node scripts/hash-password.js "the new password"
nano .env            # replace the ADMIN_PASSWORD_HASH= line with the new one
systemctl restart ahdc-dashboard
```

Everyone stays signed in until their session expires. To sign everyone out right away, also change `SESSION_SECRET` in `.env` before restarting.

## Backups

Leaving Claude Artifacts means **backups are your responsibility**. Back up `data/` and `uploads/` nightly:

```bash
mkdir -p /root/backups
crontab -e
# add this line (runs at 2:30 AM server time, keeps 30 days):
30 2 * * * tar -czf /root/backups/ahdc-$(date +\%F).tar.gz -C /root/ahdc-dashboard data uploads && find /root/backups -name 'ahdc-*.tar.gz' -mtime +30 -delete
```

Copy backups **off** the server now and then — e.g. Hostinger's backup add-on, or **(on your computer)**:

```bash
scp root@YOUR-VPS-IP:/root/backups/ahdc-*.tar.gz ~/Downloads/
```

**Restoring** **(on the VPS)**:

```bash
systemctl stop ahdc-dashboard
cd /root/ahdc-dashboard
tar -xzf /root/backups/ahdc-YYYY-MM-DD.tar.gz      # restores data/ and uploads/
systemctl start ahdc-dashboard
```

## Checking the server

```bash
systemctl status ahdc-dashboard --no-pager      # is it running?
journalctl -u ahdc-dashboard -n 100 --no-pager  # recent log messages / errors
systemctl restart ahdc-dashboard                # restart it
curl -I http://127.0.0.1:3000/login             # should answer "200 OK"
nginx -t && systemctl status nginx --no-pager   # is nginx healthy?
certbot renew --dry-run                         # will the HTTPS certificate renew?
```

## Settings reference (`.env`)

| Setting | Default | Meaning |
|---|---|---|
| `PORT` | `3000` | Port the Node app listens on (nginx forwards to it). |
| `ADMIN_PASSWORD_HASH` | — (required) | bcrypt hash of the team password, from `scripts/hash-password.js`. |
| `SESSION_SECRET` | — (required) | Long random string used to sign sign-in cookies. |
| `MAX_UPLOAD_MB` | `25` | Largest single file the client portal accepts. |
| `MAX_FILES_PER_UPLOAD` | `10` | Most files in one portal upload. |
| `COOKIE_SECURE` | on | Leave unset in production (HTTPS). Set to `false` only for local testing over `http://`. |
