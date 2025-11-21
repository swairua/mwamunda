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

# Create Apache configuration for SPA routing
RUN echo '<Directory /var/www/html>
    RewriteEngine On
    RewriteBase /

    # Don'\''t rewrite api.php requests or actual files/directories
    RewriteRule ^api\.php$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    # Rewrite all other requests to index.html for SPA routing
    RewriteRule ^ index.html [QSA,L]
</Directory>' > /etc/apache2/conf-available/spa-routing.conf

RUN a2enconf spa-routing

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
