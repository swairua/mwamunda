# Stage 1: Build React SPA
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY client ./client
COPY shared ./shared
COPY vite.config.ts tsconfig.json tailwind.config.ts postcss.config.js components.json ./

# Build the React app (uses default /api.php which Apache will proxy)
RUN pnpm build:full

# Stage 2: Runtime
FROM php:8.1-apache

# Enable required Apache modules
RUN a2enmod rewrite headers

# Copy built files from builder
COPY --from=builder /app/dist /var/www/html

# Copy PHP files
COPY api.php connection.php /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Enable Apache proxy modules
RUN a2enmod proxy proxy_http ssl

# Create Apache VirtualHost configuration for SPA routing
RUN echo '<VirtualHost *:80>
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        RewriteEngine On
        RewriteBase /

        # Allow direct access to files and directories that exist
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d

        # Don'\''t rewrite api.php or api calls
        RewriteCond %{REQUEST_URI} !^/api\.php
        RewriteCond %{REQUEST_URI} !^/api/

        # Rewrite all other requests to index.html for SPA routing
        RewriteRule ^(.*)$ index.html [QSA,L]

        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch "\.(php)$">
        SetHandler application/x-httpd-php
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

RUN a2dissite 000-default 2>/dev/null; a2ensite 000-default

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
