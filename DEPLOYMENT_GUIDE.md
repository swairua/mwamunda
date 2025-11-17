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
pnpm build
```

This generates:
- **Frontend**: `dist/spa/` - Complete React SPA with all assets
- **Backend**: `api.php` and `connection.php` - PHP backend files
- **Public Assets**: `public/` folder content

### Step 3: Verify Build
```bash
pnpm typecheck  # Verify TypeScript
pnpm test       # Run tests (optional)
```

## Deployment Architecture

Your application consists of two parts:

```
Production Server
├── dist/spa/          # Built React application (static files)
│   ├── index.html
│   ├── assets/
│   └── ...
└── api.php            # PHP REST API backend
└── connection.php     # Database configuration
└── public/            # Static assets (optional)
```

## Deployment Options

### Option 1: Static Hosting + Separate PHP Server (Recommended)

**Deploy Frontend to Static Hosting (Netlify, Vercel, etc.):**
1. Upload contents of `dist/spa/` folder
2. Configure SPA routing to redirect all routes to `index.html`
3. Set environment variable: `VITE_API_BASE_URL=https://your-api-domain.com/api.php`

**Deploy Backend to PHP Server:**
1. Upload `api.php` and `connection.php` to your PHP host
2. Configure database connection in `connection.php`
3. Ensure CORS is enabled (already configured in `api.php`)
4. Initialize database tables (call `/init` endpoints first)

### Option 2: Single Server (Same Domain)

**Deploy Everything to One PHP Server:**

1. Build the application:
   ```bash
   pnpm install
   pnpm build
   ```

2. On your server, create the following structure:
   ```
   public_html/
   ├── index.php           (Use code below)
   ├── api.php
   ├── connection.php
   ├── spa/                (Copy contents of dist/spa/ here)
   ```

3. Create `index.php` to route SPA requests:
   ```php
   <?php
   // Route SPA requests to index.html
   $requested_file = __DIR__ . '/spa' . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
   
   if (file_exists($requested_file) && !is_dir($requested_file)) {
       return false; // Let the server serve the file
   }
   
   // For any non-existent file, serve index.html (SPA routing)
   require __DIR__ . '/spa/index.html';
   ```

4. Update API configuration in `client/lib/config.ts` (already set to `/api.php`):
   ```typescript
   const defaultApiUrl = "/api.php"; // Uses relative path
   ```

5. No environment variable needed - uses default relative path.

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM php:8.1-apache
WORKDIR /var/www/html
RUN a2enmod rewrite
COPY --from=builder /app/dist/spa ./spa
COPY api.php connection.php ./
COPY .htaccess ./
EXPOSE 80
CMD ["apache2-foreground"]
```

Create `.htaccess` for Apache SPA routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

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
