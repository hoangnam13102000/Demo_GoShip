# ===============================
# 1. Base image
# ===============================
FROM php:8.2-fpm

# ===============================
# 2. System dependencies
# ===============================
RUN apt-get update && apt-get install -y \
    zip unzip git curl \
    libzip-dev libxml2-dev libonig-dev libpq-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo pdo_mysql pdo_pgsql \
        mbstring zip xml bcmath gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ===============================
# 3. Install Composer
# ===============================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ===============================
# 4. App source
# ===============================
WORKDIR /app
COPY . .

# ===============================
# 5. Prepare env for build
# ===============================
RUN cp .env.example .env

# ===============================
# 6. Install Laravel dependencies
# ===============================
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# ===============================
# 7. Generate APP_KEY
# ===============================
RUN php artisan key:generate

# ===============================
# 8. Expose port
# ===============================
EXPOSE 8080

# ===============================
# 9. Start app (migrate + seed)
# ===============================
CMD php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
