# Apache Deployment Audit & Configuration Guide

## Application Audit Summary

### ✅ Completed Tasks

1. **Dashboard Cleanup**
   - ✅ Removed 4 initialization cards from admin dashboard
   - ✅ Removed unused icon imports (Package, FileText, Briefcase)
   - Files updated: `client/pages/AdminDashboard.tsx`

2. **TypeScript Validation**
   - ✅ Fixed Career interface missing `status` property
   - ✅ All TypeScript errors resolved
   - Files updated: `client/pages/Careers.tsx`

3. **Apache Configuration**
   - ✅ Created `.htaccess` file for SPA routing
   - ✅ Enabled gzip compression
   - ✅ Configured asset caching headers
   - ✅ Set CORS headers for API
   - File created: `.htaccess`

4. **Admin Menu**
   - ✅ Products menu item is visible and enabled in admin sidebar
   - ✅ All admin navigation items properly configured
   - Files: `client/components/AdminSidebar.tsx`

---

## Preparing for Apache Deployment

### Step 1: Build the Application

```bash
npm run build:full
```

This command will:
1. Build the React frontend to `dist/` directory
2. Copy PHP backend files to `dist/`:
   - `api.php` - REST API handler
   - `connection.php` - Database configuration
   - `.htaccess` - Apache URL rewriting rules
3. Copy public assets to `dist/`

### Step 2: Deployment to Apache

1. **Upload `dist/` folder contents** to your Apache web root (usually `public_html/`)

2. **Required Apache Modules**
   ```
   mod_rewrite  (for URL rewriting)
   mod_deflate  (for compression)
   mod_expires  (for caching)
   mod_headers  (for CORS headers)
   ```

   To enable on most Apache servers:
   ```bash
   a2enmod rewrite
   a2enmod deflate
   a2enmod expires
   a2enmod headers
   systemctl restart apache2
   ```

3. **Set File Permissions**
   ```bash
   chmod 755 dist/                 # Directories
   chmod 644 dist/*.{html,php}     # Files
   chmod 644 dist/.htaccess        # Configuration
   ```

### Step 3: Configure Database Connection

Set environment variables on Apache server (via cPanel, WHM, or `.htaccess`):

```apache
SetEnv DB_HOST your-mysql-host
SetEnv DB_USER your-db-user
SetEnv DB_PASSWORD your-secure-password
SetEnv DB_NAME mwamunda
```

Or configure in `connection.php` directly if environment variables not supported.

### Step 4: Verify Installation

1. **Test Frontend**: Visit `https://yourdomain.com/`
   - Should display the home page
   - React Router navigation should work

2. **Test Admin Login**: Visit `https://yourdomain.com/admin/login`
   - Try login with your credentials
   - Should redirect to dashboard

3. **Test API**: Visit `https://yourdomain.com/api.php?table=users`
   - Should return JSON response from database
   - If error, check database configuration in `connection.php`

4. **Test SPA Routing**: 
   - Try accessing `/admin/products` directly
   - Should load correctly (not show 404)
   - `.htaccess` should rewrite to `index.html`

---

## Application Structure

### Frontend (React SPA)
- **Framework**: React 18 + React Router 6
- **Language**: TypeScript
- **Styling**: TailwindCSS 3 + Radix UI
- **Build Output**: `dist/` directory
- **Entry Point**: `dist/index.html`

### Backend (PHP API)
- **Language**: PHP 7.2+
- **Location**: `dist/api.php`
- **Database**: MySQL (configured in `connection.php`)
- **Authentication**: SHA-256 password hashing
- **CORS**: Enabled for all origins

### Routing Configuration
- **`.htaccess`**: Routes all non-file requests to `index.html`
- **React Router**: Handles client-side routing in the browser
- **Fallback**: Unmatched routes show 404 page

---

## Key Features Configured

### Admin Features
- ✅ Admin Login (`/admin/login`)
- ✅ Admin Dashboard (`/admin/dashboard`)
- ✅ Products Management (`/admin/products`)
- ✅ Applications Management (`/admin/applications`)
- ✅ Contacts Management (`/admin/contacts`)
- ✅ Careers Management (`/admin/careers`)
- ✅ User Management
- ✅ Database initialization endpoints

### Public Features
- ✅ Home Page (`/`)
- ✅ About Page (`/about`)
- ✅ Services Page (`/services`)
- ✅ Contact Form (`/contact`)
- ✅ Careers Page (`/careers`)
- ✅ Product Pages:
  - Fair Personal Loans
  - Chama Loans
  - Debt Advice Services
  - Financial Capability Training

---

## Security Checklist

- [ ] Remove `api-server.js` before uploading (development only)
- [ ] Remove `node_modules/` directory
- [ ] Remove `.env` file if it contains sensitive data
- [ ] Keep `.htaccess` permissions at 644
- [ ] Use HTTPS for all connections (enable SSL/TLS)
- [ ] Set strong database password
- [ ] Regularly backup database
- [ ] Monitor API error logs
- [ ] Keep PHP version updated (7.4+ recommended)

---

## Troubleshooting

### Issue: Blank page or 404 errors

**Solution**: `.htaccess` may not be working
- Verify `mod_rewrite` is enabled: `apache2ctl -M | grep rewrite`
- Check `.htaccess` permissions: `ls -la .htaccess` should show `-rw-r--r--`
- Check `.htaccess` is in web root, not subdirectory

### Issue: "Table name is required" error

**Solution**: Database connection or API configuration issue
- Verify `connection.php` settings
- Check database exists and is accessible
- Verify environment variables are set correctly
- Check PHP error logs: `tail -f /var/log/apache2/error.log`

### Issue: Admin login not working

**Solution**: Authentication or database issue
- Verify users table exists (check in database)
- Test API endpoint: `curl https://yourdomain.com/api.php?table=users`
- Check database user has SELECT/INSERT/UPDATE permissions
- Review API error logs

### Issue: Static assets (CSS/JS) not loading

**Solution**: Asset path or caching issue
- Clear browser cache
- Verify asset files exist in `dist/assets/`
- Check MIME types in Apache configuration
- Enable gzip compression for better performance

---

## Development to Production Workflow

1. **Local Development**
   ```bash
   npm install           # Install dependencies
   npm run dev          # Start dev server
   npm run dev:php      # Start PHP API server (port 8000)
   npm run test         # Run tests
   npm run typecheck    # Verify TypeScript
   ```

2. **Pre-Deployment**
   ```bash
   npm run typecheck    # Ensure no TypeScript errors
   npm test             # Run test suite
   npm run build:full   # Build for production
   ```

3. **Deployment**
   - Upload `dist/` contents to Apache web root
   - Configure database settings
   - Enable required Apache modules
   - Test all features

4. **Post-Deployment**
   - Verify all routes work
   - Test admin login
   - Check API endpoints
   - Monitor error logs

---

## Performance Optimization

The `.htaccess` configuration includes:

1. **Gzip Compression**
   - Reduces HTML/CSS/JS/JSON file sizes by 60-80%
   - Automatically enabled for text-based content

2. **Browser Caching**
   - Static assets cached for 1 year
   - HTML files: 2 days (no cache)
   - CSS/JS: 1 month

3. **CORS Headers**
   - Allows cross-origin requests for API
   - Supports all standard HTTP methods

---

## Deployment Checklist

- [ ] `npm run build:full` completes without errors
- [ ] `dist/` folder exists with all files
- [ ] `dist/api.php` exists
- [ ] `dist/connection.php` exists
- [ ] `dist/.htaccess` exists
- [ ] Upload all files to Apache web root
- [ ] Set proper file permissions (755 for dirs, 644 for files)
- [ ] Configure database environment variables
- [ ] Enable required Apache modules
- [ ] Test homepage loads correctly
- [ ] Test admin login works
- [ ] Test API endpoint returns data
- [ ] Test SPA routing (direct URL access works)
- [ ] Review Apache error logs for issues
- [ ] Enable HTTPS/SSL certificate
- [ ] Monitor application performance

---

## Files Modified for Apache Deployment

1. `client/pages/AdminDashboard.tsx`
   - Removed 4 initialization cards

2. `client/pages/Careers.tsx`
   - Fixed TypeScript error (added status property)

3. `.htaccess` (NEW)
   - Apache configuration for SPA routing
   - Compression, caching, CORS headers

---

## Next Steps

1. Run `npm run build:full` when ready
2. Upload `dist/` folder to Apache web root
3. Configure database connection
4. Test all features
5. Enable HTTPS/SSL
6. Monitor logs and performance

For additional help, refer to `PRODUCTION_DEPLOYMENT.md` and `DEVELOPMENT_SETUP.md`.
