# 🐳 Docker Deployment Guide for Email Guardian

## 🚀 Quick Start with Docker

### Prerequisites
- **Docker** installed on your system
- **Docker Compose** (usually included with Docker Desktop)
- **4GB RAM** minimum for AI model loading

### 1. Clone and Navigate
```bash
git clone https://github.com/ASMAEMISBAH22/email_guard.git
cd email_guard
```

### 2. Start the Full Stack
```bash
# Start all services (production mode)
docker-compose up --build

# Or start in detached mode
docker-compose up -d --build
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Development Mode

### Start Development Environment
```bash
# Start backend + development frontend with hot reload
docker-compose --profile dev up --build

# Or start specific services
docker-compose up backend frontend-dev --build
```

### Development URLs
- **Frontend (Dev)**: http://localhost:3001 (with hot reload)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛠️ Docker Commands

### Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Manage Services
```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Remove containers and volumes
docker-compose down -v
```

### Individual Container Management
```bash
# Run backend only
docker run -p 8000:8000 email_guard_backend

# Run frontend only
docker run -p 3000:80 email_guard_frontend

# Execute commands in running container
docker exec -it email-guardian-backend bash
docker exec -it email-guardian-frontend sh
```

## 📊 Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Models     │
│   (Nginx)       │◄──►│   (FastAPI)     │◄──►│   (HuggingFace) │
│   Port: 3000    │    │   Port: 8000    │    │   Cache: /tmp   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   SQLite DB     │              │
         └──────────────►│   (Volume)      │◄─────────────┘
                        │   /app/backend  │
                        └─────────────────┘
```

## 🔒 Security Features

### Container Security
- **Non-root users** in containers
- **Security headers** in nginx configuration
- **Input validation** and sanitization
- **Rate limiting** and API authentication
- **Isolated network** for inter-service communication

### Environment Variables
```bash
# Backend environment variables
PYTHONPATH=/app
TRANSFORMERS_CACHE=/app/ai/models
HF_HOME=/app/ai/models
ENVIRONMENT=production
LOG_LEVEL=info

# Frontend environment variables
REACT_APP_API_URL=http://localhost:8000
```

## 📈 Performance Optimization

### Multi-Stage Builds
- **Frontend**: Uses multi-stage build for smaller production images
- **Backend**: Optimized Python slim image
- **Caching**: Model cache persisted in Docker volumes

### Resource Limits
```yaml
# Add to docker-compose.yml for production
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
        reservations:
          memory: 2G
          cpus: '1.0'
```

## 🧪 Testing with Docker

### Run Tests in Container
```bash
# Run backend tests
docker-compose exec backend python -m pytest tests/ -v

# Run frontend tests
docker-compose exec frontend npm test

# Run integration tests
docker-compose exec backend python -m pytest tests/test_integration.py -v
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Create API key
curl -X POST "http://localhost:8000/create-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Docker Test"}'

# Test email scanning
curl -X POST "http://localhost:8000/scan" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Test email content"}'
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :8000
netstat -tulpn | grep :3000

# Use different ports
docker-compose up -p 8001:8000 -p 3001:80
```

#### 2. Memory Issues
```bash
# Check container memory usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
```

#### 3. Model Loading Issues
```bash
# Check model cache
docker-compose exec backend ls -la /app/ai/models

# Clear model cache
docker-compose down -v
docker-compose up --build
```

#### 4. Database Issues
```bash
# Check database file
docker-compose exec backend ls -la /app/backend/

# Reset database
docker-compose down -v
docker-compose up --build
```

### Debug Commands
```bash
# View container logs
docker-compose logs -f backend

# Access container shell
docker-compose exec backend bash

# Check container health
docker-compose ps

# View resource usage
docker stats
```

## 🚀 Production Deployment

### Production Configuration
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or set environment
export NODE_ENV=production
export ENVIRONMENT=production
docker-compose up -d
```

### Environment Variables
Create `.env` file for production:
```env
# Backend
ENVIRONMENT=production
LOG_LEVEL=info
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///app/backend/email_guardian.db

# Frontend
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

### Reverse Proxy Setup
```nginx
# Nginx configuration for production
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring

### Health Checks
```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:8000/health
curl http://localhost:3000

# View health check logs
docker-compose logs backend | grep health
```

### Logs and Monitoring
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Follow logs with timestamps
docker-compose logs -f -t
```

## 🎯 Benefits of Docker Deployment

### ✅ **Consistency**
- Same environment across development, staging, and production
- No "works on my machine" issues
- Reproducible builds

### ✅ **Isolation**
- Services run in isolated containers
- No conflicts between dependencies
- Secure inter-service communication

### ✅ **Scalability**
- Easy horizontal scaling
- Load balancing support
- Resource management

### ✅ **Portability**
- Run anywhere Docker is available
- Cloud platform compatibility
- Easy deployment to any environment

### ✅ **Maintenance**
- Simple updates and rollbacks
- Easy backup and restore
- Version control for infrastructure

## 🎉 Quick Commands Summary

```bash
# Start everything
docker-compose up --build

# Development mode
docker-compose --profile dev up --build

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean up
docker-compose down -v
docker system prune -a
```

---

**🎉 Your Email Guardian is now fully containerized and ready for deployment!** 