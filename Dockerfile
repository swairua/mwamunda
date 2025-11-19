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

# Build the React app with API configuration
ARG VITE_API_BASE_URL=https://mwamunda.ziratech.com/api.php
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
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

# Create Apache configuration for API proxy and SPA routing
RUN echo '<Directory /var/www/html>\n\
    RewriteEngine On\n\
    RewriteBase /\n\
    RewriteRule ^api\.php$ - [L]\n\
    RewriteCond %{REQUEST_FILENAME} !-f\n\
    RewriteCond %{REQUEST_FILENAME} !-d\n\
    RewriteRule ^ /index.html [QSA,L]\n\
</Directory>\n\
\n\
ProxyPreserveHost On\n\
ProxyPass /api.php https://mwamunda.ziratech.com/api.php\n\
ProxyPassReverse /api.php https://mwamunda.ziratech.com/api.php\n\
RequestHeader set X-Forwarded-Proto https\n\
RequestHeader set X-Forwarded-Host %{HTTP_HOST}s' > /etc/apache2/conf-available/spa-routing.conf

RUN a2enconf spa-routing

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
