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

# Build the React app
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

# Create Apache configuration for SPA routing
RUN echo '<Directory /var/www/html>\n\
    RewriteEngine On\n\
    RewriteBase /\n\
    RewriteRule ^api\.php$ - [L]\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteCond %{REQUEST_FILENAME} !-d\n\
    RewriteRule ^ /index.html [QSA,L]\n\
</Directory>' > /etc/apache2/conf-available/spa-routing.conf

RUN a2enconf spa-routing

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
