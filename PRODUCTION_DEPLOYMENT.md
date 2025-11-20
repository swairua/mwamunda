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

2. **PHP version:** 7.2+ required

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

## How It Works

- Frontend requests to `/api.php` are handled by PHP directly
- No Node.js process runs in production
- All API calls go through `api.php` → `connection.php` → MySQL
- `.htaccess` routes everything else to `index.html` for React Router

## Verification

After deployment, test:

1. **Admin Login:**
   - Email: `admin@mwamunda.com`
   - Password: `Pass123`

2. **Check API:**
   - Visit `https://yourdomain.com/api.php?table=users`
   - Should return JSON (if database is connected)

## Security Notes

⚠️ Remember to:

- Remove `db.json` (dev-only file) before deploying
- Keep `api-server.js` on local machine only
- Update `DB_PASSWORD` in production
- Use HTTPS in production
