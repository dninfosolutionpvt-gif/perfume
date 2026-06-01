#!/bin/bash

# ==========================================================================
# Orova Paris - Live Custom Next.js & Express VPS Ubuntu Deployment Script
# Target Domain: orovaparis.com
# ==========================================================================

# Exit immediately if a command exits with a non-zero status
set -e

echo "============================================="
echo "Deploying Orova Paris Custom React App on VPS..."
echo "============================================="

# 1. Update system packages and install Node.js and PM2
echo "Step 1: Installing Node.js & Process Manager (PM2)..."
sudo apt update -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2

# 2. Setup folder and pull latest code from GitHub
echo "Step 2: Fetching code from repository..."
sudo mkdir -p /var/www/orova-app
sudo chown -R $USER:$USER /var/www/orova-app

# Clone repo to application path
cd /var/www/orova-app
if [ -d ".git" ]; then
    echo "Repository already exists, pulling latest..."
    git pull origin main
else
    echo "Cloning repository..."
    git clone https://github.com/dninfosolutionpvt-gif/perfume.git .
fi

# 3. Configure and Launch Backend
echo "Step 3: Building and launching Backend Server..."
cd /var/www/orova-app/backend
npm install

# Write environment configuration
cat > .env <<EOF
PORT=5000
DB_HOST=150.242.202.223
DB_USER=perfume_user
DB_PASSWORD=OrovaPerfumePass2026!
DB_NAME=perfume_db
DB_PORT=5432
EOF

# Start Backend using PM2
pm2 stop orova-backend || true
pm2 start src/index.js --name "orova-backend"
echo "Backend successfully launched under PM2."

# 4. Configure and Build Frontend
echo "Step 4: Building and launching Next.js Frontend..."
cd /var/www/orova-app/frontend
npm install

# Build Next.js production bundle
npm run build

# Start Frontend using PM2
pm2 stop orova-frontend || true
pm2 start npm --name "orova-frontend" -- start -- -p 3000
echo "Frontend successfully launched under PM2."

# Save PM2 process list to persist on reboot
pm2 save
sudo pm2 startup || true

# 5. Configure Nginx Server Blocks for Reverse Proxy
echo "Step 5: Configuring Nginx Reverse Proxy for orovaparis.com..."
NGINX_CONF="/etc/nginx/sites-available/orovaparis.com"

sudo bash -c "cat > ${NGINX_CONF}" <<EOF
server {
    listen 80;
    server_name orovaparis.com www.orovaparis.com;

    # Reverse proxy to Next.js Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Reverse proxy to Express Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 64M;
}
EOF

# Enable site and test Nginx configuration
sudo ln -sf /etc/nginx/sites-available/orovaparis.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "======================================================"
echo "Orova Paris Custom React App successfully deployed live!"
echo "Visit: http://orovaparis.com to view your beautiful website!"
echo "======================================================"
