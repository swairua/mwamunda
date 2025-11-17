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

### Production with External API
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api.php
```

Then rebuild:
```bash
pnpm build
```

## Database Setup

After deploying, initialize the database:

1. Call the initialization endpoints:
   ```bash
   curl -X POST http://your-domain/api.php \
     -H "Content-Type: application/json" \
     -d '{"action": "init_users_table"}'
   
   curl -X POST http://your-domain/api.php \
     -H "Content-Type: application/json" \
     -d '{"action": "init_contacts_table"}'
   ```

2. Or use the admin setup page: `http://your-domain/admin/setup`

## Production Checklist

- [ ] Run `pnpm build` successfully
- [ ] Verify `dist/spa/` folder contains built files
- [ ] Update database credentials in `connection.php`
- [ ] Test API endpoints are accessible
- [ ] Configure API URL (default `/api.php` or environment variable)
- [ ] Initialize database tables
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
- Edit `api.php` and update the CORS origin header if needed
- For production: `header("Access-Control-Allow-Origin: https://yourdomain.com");`

## Offline Build Process Summary

```bash
# 1. Install dependencies (one time or after updates)
pnpm install

# 2. Build application
pnpm build

# 3. Verify build output
ls -la dist/spa/

# 4. Deploy
# - Copy dist/spa/* to your static host
# - Copy api.php, connection.php to your PHP server
# - Update connection.php with your database credentials
# - Test all endpoints
```

Your application is now ready for offline building and direct deployment!
