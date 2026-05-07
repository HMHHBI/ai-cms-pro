FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
  git curl libpng-dev libonig-dev libxml2-dev zip unzip nodejs npm libpq-dev

RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# 🔥 critical Laravel runtime safety
RUN mkdir -p \
  storage/framework/cache \
  storage/framework/sessions \
  storage/framework/views \
  bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

# ✅ IMPORTANT: use a bootstrap script instead of raw artisan commands
CMD ["sh", "-c", "php artisan config:clear && php artisan view:clear && php artisan cache:clear && php artisan migrate --force && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=10000"]