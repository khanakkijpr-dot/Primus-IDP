#!/bin/bash
# ===========================================
# Primus IDP - One-Click Deployment Script
# ===========================================
# This script deploys Primus IDP to a VPS with Docker

set -e

echo "🚀 Primus IDP Deployment Script"
echo "================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  Please run as root (sudo ./deploy.sh)"
  exit 1
fi

# Check for required environment variables
if [ -z "$DOMAIN" ]; then
  read -p "Enter your domain (e.g., primusidp.net): " DOMAIN
  export DOMAIN
fi

if [ -z "$ACME_EMAIL" ]; then
  read -p "Enter email for SSL certificates: " ACME_EMAIL
  export ACME_EMAIL
fi

# Generate secure passwords if not set
if [ -z "$POSTGRES_PASSWORD" ]; then
  export POSTGRES_PASSWORD=$(openssl rand -hex 24)
  echo "📝 Generated PostgreSQL password"
fi

if [ -z "$REDIS_PASSWORD" ]; then
  export REDIS_PASSWORD=$(openssl rand -hex 24)
  echo "📝 Generated Redis password"
fi

if [ -z "$SECRET_KEY" ]; then
  export SECRET_KEY=$(openssl rand -hex 32)
  echo "📝 Generated Secret Key"
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# Install Docker Compose plugin if not present
if ! docker compose version &> /dev/null; then
  echo "📦 Installing Docker Compose plugin..."
  apt-get update && apt-get install -y docker-compose-plugin
fi

# Create .env file for production
echo "📝 Creating production environment file..."
cat > .env << EOF
DOMAIN=${DOMAIN}
ACME_EMAIL=${ACME_EMAIL}
POSTGRES_USER=primus
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=primus_idp
REDIS_PASSWORD=${REDIS_PASSWORD}
SECRET_KEY=${SECRET_KEY}
EOF

echo "🔐 Credentials saved to .env"
echo ""
echo "=========================================="
echo "SAVE THESE CREDENTIALS SECURELY!"
echo "=========================================="
echo "Domain: ${DOMAIN}"
echo "PostgreSQL Password: ${POSTGRES_PASSWORD}"
echo "Redis Password: ${REDIS_PASSWORD}"
echo "Secret Key: ${SECRET_KEY}"
echo "=========================================="
echo ""

# Pull and build images
echo "🔨 Building Docker images..."
docker compose -f docker-compose.prod.yml build

# Start services
echo "🚀 Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "📊 Running database migrations..."
docker compose -f docker-compose.prod.yml exec -T backend alembic upgrade head

# Create default admin user
echo "👤 Creating admin user..."
docker compose -f docker-compose.prod.yml exec -T backend python -c "
from app.users import create_user
import asyncio

async def create_admin():
    await create_user('admin@${DOMAIN}', 'PrimusAdmin2024!')
    print('Admin user created: admin@${DOMAIN}')

asyncio.run(create_admin())
" 2>/dev/null || echo "Admin user may already exist"

echo ""
echo "✅ Deployment Complete!"
echo "=========================================="
echo "🌐 Frontend: https://${DOMAIN}"
echo "🔧 API Docs: https://api.${DOMAIN}/docs"
echo "📊 Traefik Dashboard: https://traefik.${DOMAIN}"
echo ""
echo "👤 Default Admin:"
echo "   Email: admin@${DOMAIN}"
echo "   Password: PrimusAdmin2024!"
echo ""
echo "⚠️  IMPORTANT: Change the admin password immediately!"
echo "=========================================="
