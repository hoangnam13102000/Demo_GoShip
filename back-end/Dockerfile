# 1. Base image
FROM php:8.2-fpm

# 2. System deps
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. App
WORKDIR /app
COPY . .

# 5. Install deps
RUN composer install --no-dev --optimize-autoloader

# 6. Expose port
EXPOSE 8080

# 7. Start app
CMD php artisan migrate --force \
    && php -S 0.0.0.0:8080 -t public
