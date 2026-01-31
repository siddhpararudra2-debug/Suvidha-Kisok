# SUVIDHA - Deployment Guide

This guide covers deploying SUVIDHA in development, staging, and production environments.

---

## Prerequisites

### Required Software
- **Node.js**: 20.x LTS
- **npm**: 10.x
- **Docker**: 24.x
- **Docker Compose**: 2.x
- **PostgreSQL**: 16.x (or use Docker)
- **Redis**: 7.x (or use Docker)

### Hardware Requirements (Production)
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Storage | 20 GB SSD | 50 GB SSD |
| Network | 100 Mbps | 1 Gbps |

---

## 1. Development Setup

### Clone & Install
```bash
# Clone repository
git clone https://github.com/suvidha/kiosk-app.git
cd kiosk-app

# Install dependencies
npm install
```

### Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

### Run Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000
```

---

## 2. Docker Deployment

### Build Containers
```bash
# Build all containers
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### Start Services
```bash
# Start all services (detached)
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Environment Variables
Create `.env` file in project root:
```env
# Database
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_256_bit_secret_key

# External APIs (production)
AADHAAR_API_KEY=sandbox_key
DIGILOCKER_CLIENT_ID=your_client_id
DIGILOCKER_SECRET=your_secret
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## 3. Production Deployment

### 3.1 Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Install Nginx (for reverse proxy)
sudo apt install nginx certbot python3-certbot-nginx
```

### 3.2 SSL Certificate

```bash
# Get Let's Encrypt certificate
sudo certbot --nginx -d suvidha.gov.in -d api.suvidha.gov.in

# Auto-renewal is configured automatically
```

### 3.3 Nginx Configuration

Create `/etc/nginx/sites-available/suvidha`:
```nginx
server {
    listen 80;
    server_name suvidha.gov.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name suvidha.gov.in;

    ssl_certificate /etc/letsencrypt/live/suvidha.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/suvidha.gov.in/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/suvidha /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.4 Deploy Application

```bash
# Clone to production server
cd /opt
sudo git clone https://github.com/suvidha/kiosk-app.git
cd kiosk-app

# Copy production env
sudo cp .env.production .env

# Start services
sudo docker-compose up -d
```

### 3.5 Database Backup

```bash
# Create backup script
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec suvidha-db pg_dump -U suvidha suvidha_db > /backups/suvidha_$DATE.sql
find /backups -name "*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /opt/backup-db.sh" | crontab -
```

---

## 4. Health Checks

### Endpoints
| Endpoint | Expected Response |
|----------|-------------------|
| `GET /health` | `{"status": "ok"}` |
| `GET /api/health` | `{"status": "ok", "db": "connected"}` |

### Monitoring Script
```bash
#!/bin/bash
HEALTH=$(curl -s http://localhost:4000/health)
if [[ $HEALTH != *"ok"* ]]; then
  echo "Backend unhealthy, restarting..."
  docker-compose restart backend
fi
```

---

## 5. Scaling

### Horizontal Scaling with Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack with replicas
docker stack deploy -c docker-compose.yml suvidha

# Scale API servers
docker service scale suvidha_backend=3
```

### Load Balancer Configuration
```nginx
upstream backend_servers {
    server backend1:4000;
    server backend2:4000;
    server backend3:4000;
    keepalive 32;
}
```

---

## 6. Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - DATABASE_URL incorrect
# - Port already in use
# - Missing environment variables
```

### Database Connection Failed
```bash
# Test connection
docker exec suvidha-db pg_isready -U suvidha

# Check if database exists
docker exec suvidha-db psql -U suvidha -c "\l"
```

### Redis Connection Failed
```bash
# Test Redis
docker exec suvidha-cache redis-cli ping
# Should return: PONG
```

### Clear All Data (Development Only)
```bash
# WARNING: Deletes all data
docker-compose down -v
docker-compose up -d
```

---

## 7. Useful Commands

```bash
# View running containers
docker ps

# Enter container shell
docker exec -it suvidha-api sh

# View real-time logs
docker-compose logs -f --tail=100

# Restart specific service
docker-compose restart backend

# Rebuild single service
docker-compose up -d --build backend

# Check disk usage
docker system df

# Clean unused images
docker image prune -a
```

---

## 8. Security Checklist

- [ ] Change default database password
- [ ] Set strong JWT_SECRET (256-bit)
- [ ] Enable SSL/TLS
- [ ] Configure firewall (allow 80, 443 only)
- [ ] Set up fail2ban
- [ ] Enable automatic security updates
- [ ] Configure log rotation
- [ ] Set up intrusion detection

---

*Last Updated: January 2026*
*Version: 1.0.0*
