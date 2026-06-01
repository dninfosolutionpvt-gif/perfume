#!/bin/bash

# ==========================================================================
# Orova Paris - Live WordPress & WooCommerce VPS Ubuntu Deployment Script
# Target Domain: orovaparis.com
# ==========================================================================

# Exit immediately if a command exits with a non-zero status
set -e

echo "============================================="
echo "Starting Orova Paris WordPress VPS Setup..."
echo "============================================="

# 1. Update system packages and install LAMP/LEMP dependencies
echo "Step 1: Installing System Dependencies (Nginx, PHP 8.4, MySQL)..."
sudo apt update -y
sudo apt install -y nginx mysql-server php-fpm php-mysql php-curl php-gd php-intl php-mbstring php-soap php-xml php-xmlrpc php-zip unzip git

# 2. Secure MySQL and create Database/User using Debian maintenance config (resilient authentication)
echo "Step 2: Configuring Database..."
DB_NAME="orova_wp_db"
DB_USER="orova_wp_user"
DB_PASS="OrovaWPPass2026!"

# Run SQL commands using debian maintenance configuration to bypass password prompts
sudo mysql --defaults-file=/etc/mysql/debian.cnf -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql --defaults-file=/etc/mysql/debian.cnf -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
sudo mysql --defaults-file=/etc/mysql/debian.cnf -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql --defaults-file=/etc/mysql/debian.cnf -e "FLUSH PRIVILEGES;"
echo "Database and user created successfully."

# 3. Download and Configure WordPress Core
echo "Step 3: Fetching WordPress Core..."
cd /var/www
sudo wget -q https://wordpress.org/latest.tar.gz
sudo tar -xzf latest.tar.gz
sudo mv wordpress orovaparis
sudo rm -f latest.tar.gz

# Configure wp-config.php
echo "Step 4: Setting Up Config Files..."
cd /var/www/orovaparis
sudo cp wp-config-sample.php wp-config.php
sudo sed -i "s/database_name_here/${DB_NAME}/" wp-config.php
sudo sed -i "s/username_here/${DB_USER}/" wp-config.php
sudo sed -i "s/password_here/${DB_PASS}/" wp-config.php

# 4. Clone Orova Themes & Plugins from GitHub
echo "Step 5: Deploying Custom Orova Luxury Theme & Scent Quiz Plugin..."
sudo mkdir -p /tmp/orova-git
cd /tmp/orova-git
sudo git clone https://github.com/dninfosolutionpvt-gif/perfume.git
cd perfume

# Copy custom Orova theme and quiz plugin into target WordPress paths
sudo cp -r wordpress/wp-content/themes/orova-luxury-theme /var/www/orovaparis/wp-content/themes/
sudo cp -r wordpress/wp-content/plugins/orova-scent-quiz /var/www/orovaparis/wp-content/plugins/

# Clean up temp files
sudo rm -rf /tmp/orova-git

# 5. Set Linux directory permissions
echo "Step 6: Configuring Permissions..."
sudo chown -R www-data:www-data /var/www/orovaparis
sudo find /var/www/orovaparis/ -type d -exec chmod 755 {} \;
sudo find /var/www/orovaparis/ -type f -exec chmod 644 {} \;

# 6. Dynamically Detect Installed PHP-FPM version on Server (e.g. PHP 8.4, 8.2)
echo "Step 7: Detecting active PHP-FPM socket..."
PHP_SOCKET=$(find /var/run/php/ -name "php*-fpm.sock" | head -n 1)

if [ -z "$PHP_SOCKET" ]; then
    echo "Warning: Could not find active PHP-FPM socket. Falling back to default php8.4-fpm.sock."
    PHP_SOCKET="/var/run/php/php8.4-fpm.sock"
fi
echo "Active PHP socket found at: $PHP_SOCKET"

# 7. Configure Nginx Server Blocks
echo "Step 8: Creating Nginx Server Block..."
NGINX_CONF="/etc/nginx/sites-available/orovaparis.com"

sudo bash -c "cat > ${NGINX_CONF}" <<EOF
server {
    listen 80;
    server_name orovaparis.com www.orovaparis.com;
    root /var/www/orovaparis;

    index index.php index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.php?\$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:${PHP_SOCKET};
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$ {
        expires max;
        log_not_found off;
    }

    client_max_body_size 64M;
}
EOF

# Enable site and test Nginx configuration
sudo ln -sf /etc/nginx/sites-available/orovaparis.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "============================================="
echo "Orova Paris WordPress successfully deployed!"
echo "Navigate to: http://orovaparis.com/wp-admin to complete setup."
echo "============================================="
