# Deployment Guide - Offline Building & Direct Deployment

This guide explains how to build and deploy your application offline without external dependencies.

## Prerequisites

- Node.js (v18+)
- pnpm package manager
- PHP 7.4+ (for backend)
- MySQL database

## Building Offline

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Build the Application

```bash
# Build frontend and copy API files
pnpm build:full
```

This generates in `dist/` folder:

- **Frontend**: `index.html`, `assets/` - Complete React SPA with all assets
- **Backend**: `api.php` and `connection.php` - PHP backend files (copied to dist/)
- **Public Assets**: Static assets from `public/` folder

### Step 3: Verify Build

```bash
pnpm typecheck  # Verify TypeScript
pnpm test       # Run tests (optional)
ls -la dist/    # Verify all files are present
```

## Deployment Architecture

Everything builds into a single `dist/` folder:

```
dist/                     # Complete application ready to deploy
├── index.html            # React SPA entry point
├── assets/               # Built JavaScript, CSS, images
├── api.php               # PHP REST API backend
├── connection.php        # Database configuration
└── [other static files]
```

This single folder can be deployed directly to any PHP-capable server.

## Deployment Options

### Option 1: Deploy to Fly.io (Recommended for Fly.io users)

```bash
# 1. Build locally
pnpm build:full

# 2. Deploy using Fly.io CLI
flyctl deploy

# 3. Configure database
flyctl ssh console
# Then set environment variables in fly.toml and redeploy
```

The `Dockerfile` and `fly.toml` are already configured and will:

- Build the React frontend
- Set up PHP/Apache runtime
- Copy all files to the correct locations
- Enable SPA routing automatically

### Option 2: Deploy to Any PHP Server (cPanel, Shared Hosting, etc.)

```bash
# 1. Build locally
pnpm build:full

# 2. Upload `dist/` folder contents to your server root (public_html or www)
# Copy all files from dist/ to your server, preserving the directory structure

# 3. Ensure .htaccess is in the root (already provided)

# 4. Configure database in api.php or via environment variables:
#    DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

### Option 3: Docker Deployment (Any Docker-compatible host)

```bash
# 1. Build Docker image
docker build -t fusion-app .

# 2. Run container
docker run -p 80:80 \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-db-user \
  -e DB_PASSWORD=your-db-password \
  -e DB_NAME=your-db-name \
  fusion-app

# 3. Access at http://localhost
```

The `Dockerfile` is already configured to:

- Build the React frontend
- Set up PHP/Apache environment
- Enable all required modules
- Configure SPA routing via .htaccess
- Serve everything from a single dist/ folder

## Environment Variables

### Development

```bash
# Uses relative path - API at /api.php (same server)
# No environment variable needed - default
```

### Production

Keep the API on the same origin as the site (the default, `/api.php`). The
admin session cookie is `SameSite=Strict`, so an API on a different site would
never receive it. A different origin on the same site (for example `www.` and
the bare domain) must be listed in the API's `ALLOWED_ORIGINS` setting.

## Database Setup

The API does not create tables or accounts over HTTP. After deploying:

1. Create the tables: `php scripts/admin.php init-schema`, or paste
   `database/schema.sql` into phpMyAdmin.
2. Create the first admin: `php scripts/admin.php create-admin you@example.com`.

See `PRODUCTION_DEPLOYMENT.md` for the phpMyAdmin-only steps and for upgrading
a site that ran the old API.

## Production Checklist

- [ ] Run `pnpm build` successfully
- [ ] Verify `dist/spa/` folder contains built files
- [ ] Update database credentials in `connection.php`
- [ ] Test API endpoints are accessible
- [ ] Configure API URL (default `/api.php` or environment variable)
- [ ] Create database tables (`database/schema.sql`) and the first admin (`scripts/admin.php`)
- [ ] Confirm `/api.php?table=users` answers 401 when signed out
- [ ] Set proper file permissions on server
- [ ] Enable HTTPS (important for production)
- [ ] Configure firewall to allow database access
- [ ] Set up database backups
- [ ] Monitor error logs

## Troubleshooting

### API Not Found

- Ensure `api.php` is in the correct location
- Check CORS headers in `api.php`
- Verify database connection in `connection.php`

### Routes Not Working

- Verify SPA routing is configured (see `.htaccess` or server config)
- Check that `index.html` redirects non-file requests

### Database Connection Issues

- Verify MySQL credentials in `connection.php`
- Check database user has required privileges
- Ensure database is running and accessible

### CORS Errors

- The API only answers the site's own origins. Serve the site and `api.php` from the same origin, or add the other origin to `ALLOWED_ORIGINS`
- Do not add `Access-Control-Allow-Origin` in `.htaccess`; it would override the API's own header

## Offline Build Process Summary

```bash
# 1. Install dependencies (one time or after updates)
pnpm install

# 2. Verify code quality (optional)
pnpm typecheck
pnpm test

# 3. Build application (includes all files: frontend + API)
pnpm build:full

# 4. Verify build output has everything needed
ls -la dist/
# Should see: index.html, api.php, connection.php, assets/, etc.

# 5. Deploy dist/ folder to your server
# Option A: Copy to server
scp -r dist/* user@your-server:/var/www/html/

# Option B: Docker
docker build -t myapp .
docker push myregistry/myapp
# Then deploy container to your platform

# 6. Configure database credentials on server
#    Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME environment variables

# 7. Create tables and the first admin (once, on the server)
php scripts/admin.php init-schema
php scripts/admin.php create-admin you@example.com
```

## Development

For local development with PHP API support:

```bash
# Terminal 1: Start PHP server (serves api.php on port 8000)
pnpm dev:php

# Terminal 2: Start Vite dev server (proxies /api.php to localhost:8000)
pnpm dev

# Or run both together
pnpm dev:full
```

Your application is now ready for offline building and direct deployment!
