# Production Deployment Guide

## Overview

This application uses **PHP-only backend** for production on shared Apache hosting. NO Node.js is required.

## Build for Production

```bash
npm run build:full
```

This command:

1. Builds the React frontend → `dist/` folder
2. Copies PHP backend files to `dist/`:
   - `api.php` - API handler
   - `connection.php` - Database connection
   - `.htaccess` - Apache URL rewriting

## Files to Deploy to Apache

Upload the **entire `dist/` folder** to your web server:

```
dist/
├── index.html          (React app entry)
├── api.php             (API backend - NO Node.js!)
├── connection.php      (Database config)
├── .htaccess           (URL routing)
├── assets/             (CSS, JS bundles)
└── public/             (Images, fonts, etc)
```

## Apache Configuration Required

1. **Ensure Apache modules are enabled:**

   ```
   mod_rewrite
   mod_headers
   ```

2. **PHP version:** 7.4+ required (with mysqli / mysqlnd)

3. **Permissions:**
   - Web root: 755 (rwxr-xr-x)
   - PHP files: 644 (rw-r--r--)

## Environment Variables

Set these on your Apache server (in `.htaccess` or control panel):

```
DB_HOST=your-mysql-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=mwamunda
```

`DB_USER` and `DB_NAME` are required. If they are missing the API answers
500 and writes "Database settings are missing" to the PHP error log; it no
longer falls back to `root` with an empty password.

Optional:

```
# Extra browser origins allowed to call the API. The site's own host is
# always allowed; the default list is the two mwamunda.co.ke origins.
ALLOWED_ORIGINS=https://mwamunda.co.ke,https://www.mwamunda.co.ke
```

```
# Only when the site sits behind a proxy or CDN. See "Login rate limiting and
# the visitor's address" below before setting it.
TRUSTED_PROXY_IP_HEADER=X-Forwarded-For
```

Do not set `APP_ENV=development` on a live server: it lets the session cookie
travel over plain http and lets the API try a local `root` database login.

## How It Works

- Frontend requests to `/api.php` are handled by PHP directly
- No Node.js process runs in production
- All API calls go through `api.php` → `connection.php` → MySQL
- `.htaccess` routes everything else to `index.html` for React Router

## Database tables

The API does not create tables. Run `database/schema.sql` once (it only
creates what is missing):

```bash
php scripts/admin.php init-schema
```

or paste the file into phpMyAdmin's SQL tab.

## Admin accounts

There is no default account and no public sign-up page. Only users whose
`role` is `admin` can sign in.

With shell access:

```bash
php scripts/admin.php list-users      # the Password column says "reset needed" for old accounts
php scripts/admin.php create-admin you@example.com "Your Name"   # asks for a password (10 to 72 characters)
php scripts/admin.php remove-user someone@example.com
```

`create-admin` on an existing email turns that account into an admin and
replaces its password.

The script reads the same `DB_*` settings as the site, but from the shell:
values set only with `SetEnv` in `.htaccess` are not visible there, so export
them first (`export DB_USER=... DB_PASSWORD=... DB_NAME=...`).

Without shell access (phpMyAdmin only), make the password hash on any
computer that has PHP 7.4 or newer, then paste it in:

```bash
php -r 'echo password_hash("your new password here", PASSWORD_DEFAULT), PHP_EOL;'
```

```sql
-- 1. See who has an account. Delete any you do not recognise.
SELECT id, email, name, role, created_at FROM users;
DELETE FROM users WHERE email = 'unknown@example.com';

-- 2. Give your own account the new password and make it an admin.
UPDATE users
   SET password = '$2y$10$...the hash printed above...', role = 'admin'
 WHERE email = 'you@example.com';
```

Do not use a website to make the hash: that would mean typing the password
into someone else's server. Further admins can then be added from the
dashboard ("Add User").

### Upgrading a site that ran the old API

1. Run `database/schema.sql` (adds the `login_attempts` table).
2. Review the `users` table as above. The old API let anyone register and
   created every account with role `user`, so nobody is an admin until you
   promote the accounts you trust, and unknown accounts should be deleted.
3. Earlier versions of this guide published a default admin login. If an
   account with that email exists, remove it.
4. **No old password works any more.** The old API returned each account's
   unsalted SHA-256 password hash to anyone who asked, and let anyone
   overwrite a user's password or role, so the new API refuses every old
   hash: signing in with one fails like a wrong password. Give each admin a
   new password with `create-admin` (or the phpMyAdmin steps above) as part
   of the deploy. Until you do, nobody can sign in to the admin area.

## Character set

`connection.php` now connects as `utf8mb4` (full UTF-8). MySQL's plain `utf8`
holds at most 3 bytes per character, so an emoji in a contact message or loan
application made the insert fail and the enquiry was lost.

The connection is only half of it: a table that is still `utf8` (or
`latin1`) will reject the same characters. `database/schema.sql` creates new
tables as `utf8mb4`, but it never changes a table that already exists. Check
the live ones in phpMyAdmin:

```sql
SELECT TABLE_NAME, TABLE_COLLATION
  FROM information_schema.TABLES
 WHERE TABLE_SCHEMA = DATABASE();
```

A collation starting with `utf8mb4_` is fine. Anything else (`utf8_...`,
`utf8mb3_...`, `latin1_...`) should be converted, table by table, in a quiet
period and **after taking a backup**:

```sql
ALTER TABLE contacts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Nothing in this repository runs that for you. If the live `connection.php`
is not the one from this repository, make the same one-line change there:
`$conn->set_charset('utf8mb4');`.

## Login rate limiting and the visitor's address

Sign-in attempts are counted in the `login_attempts` table over a 15-minute
window:

- 10 attempts for one email from one address: the limit that normally
  applies. It is per address on purpose, so someone guessing at an admin's
  email from elsewhere cannot lock that admin out.
- 200 attempts for one email from all addresses together, and 300 from one
  address across all emails. These only stop large-scale guessing.

Attempts made while blocked are not recorded, rows older than the window are
deleted on every attempt, and if the table is missing the API logs
"Login rate limiting is unavailable" and lets logins through unlimited rather
than locking everyone out. Treat that log line as a setup error to fix.

**Check which address PHP sees.** The address is `REMOTE_ADDR`. Behind a
proxy or CDN that can be the proxy's address for every visitor, which makes
"per address" mean "everyone together": ten wrong passwords from anywhere
would then block an admin's email for everybody. After deploying:

1. From your own connection, try to sign in once with a wrong password.
2. In phpMyAdmin run
   `SELECT ip, attempted_at FROM login_attempts ORDER BY id DESC LIMIT 5;`
3. Compare `ip` with your own public address (search "what is my IP").

If they match, there is nothing to do. If `ip` is some other address, PHP is
seeing the proxy. Find out from the host which request header carries the
visitor's address (common ones: `X-Forwarded-For`, `X-Real-IP`,
`CF-Connecting-IP`), or look for yourself with a temporary file:

```php
<?php // whoami.php - delete this file as soon as you have the answer
header('Content-Type: text/plain');
foreach (['REMOTE_ADDR', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CF_CONNECTING_IP', 'HTTP_TRUE_CLIENT_IP'] as $key) {
    echo $key, ': ', $_SERVER[$key] ?? '(not set)', "\n";
}
```

Then set `TRUSTED_PROXY_IP_HEADER` to that header's name (for example
`X-Forwarded-For`) and repeat the check.

Only set it when every request really does come through the proxy. A header
is just text the sender chooses: if the server can also be reached directly,
anyone can put a different made-up address in it on each try and dodge the
per-address limits (the per-email ceiling still applies). When the header
holds a list, the API uses the last entry, the one the proxy itself added.

## Verification

After deployment, check:

1. `https://yourdomain.com/api.php?table=users` answers **401** with
   `{"error":"Authentication required"}` when you are not signed in.
2. `https://yourdomain.com/api.php?table=careers` answers 200 with a JSON list.
3. You can sign in at `/admin/login`, and signing out sends you back there.
4. The address recorded in `login_attempts` is your own (see above).

## Security Notes

⚠️ Remember to:

- Remove `db.json` (dev-only file) before deploying
- Keep `api-server.js` on local machine only
- Update `DB_PASSWORD` in production
- Use HTTPS in production (the admin session cookie is `Secure` and will not work without it)
- Do not add CORS headers in `.htaccess`; `api.php` sends its own, to the site's origins only
- Keep `scripts/` and `database/` out of the web root, or leave them off the server
