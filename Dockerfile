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

# Remove default Apache configuration
RUN rm -f /etc/apache2/sites-enabled/*

# Create Apache VirtualHost configuration for SPA routing
RUN echo '<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options -MultiViews
        AllowOverride All

        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /

            # Allow direct access to existing files and directories
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d

            # Rewrite all other requests to index.html for React Router
            RewriteRule ^ index.html [QSA,L]
        </IfModule>

        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

RUN a2ensite 000-default

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
