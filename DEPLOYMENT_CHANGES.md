# Deployment Configuration Changes

## Overview
This document explains the changes made to deploy the application from local development to AWS EC2.

---

## Key Change: API URL Configuration

### Problem
The frontend was hardcoded to call `http://localhost:5000/api`, which works in local development but fails in production because:
- Browser runs on user's machine
- `localhost` refers to user's computer, not the EC2 server
- API calls fail with `ERR_CONNECTION_REFUSED`

### Solution
Changed frontend to use **relative URLs** that are proxied through nginx.

---

## Files Changed

### 1. `frontend/src/services/api.js`

**Before (Local Development):**
```javascript
import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: base,
  timeout: 5000
});

export default instance;
```

**After (Production - AWS EC2):**
```javascript
import axios from 'axios';

const base = '/api';

const instance = axios.create({
  baseURL: base,
  timeout: 5000
});

export default instance;
```

**Why this works:**
- `/api` is a relative URL
- Browser calls `http://54.237.198.227/api/cows` (same domain)
- Nginx proxies `/api/*` requests to backend container
- No CORS issues, no localhost problems

---

### 2. `frontend/nginx.conf`

**Configuration:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://cattle_backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**How it works:**
1. Browser requests: `http://54.237.198.227/api/cows`
2. Nginx receives request on port 80
3. Nginx proxies to: `http://cattle_backend:5000/api/cows`
4. Backend responds with data
5. Nginx returns data to browser

---

### 3. `frontend/Dockerfile.prod`

**Fixed:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Changes:**
- Changed `npm ci` to `npm install` (no package-lock.json)
- Multi-stage build: build React app, serve with nginx
- Copies nginx.conf for API proxying

---

## Architecture Comparison

### Local Development
```
Browser → http://localhost:3000 (Vite dev server)
          ↓
          Calls http://localhost:5000/api (direct to backend)
          ↓
Backend → Port 5000
```

### AWS EC2 Production
```
Browser → http://54.237.198.227 (nginx on port 80)
          ↓
          Calls /api/cows (relative URL)
          ↓
Nginx → Proxies to http://cattle_backend:5000/api/cows
          ↓
Backend → Port 5000 (internal Docker network)
```

---

## Environment Variables

### Removed
- `VITE_API_URL` - No longer needed, using relative URLs

### Current `.env` (EC2)
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=cattle_admin
DB_PASSWORD=<secure_password>
DB_NAME=cattle_management_db
DATABASE_URL=postgresql://cattle_admin:<password>@postgres:5432/cattle_management_db

NODE_ENV=production
PORT=5000
JWT_SECRET=<secure_secret>
```

---

## Docker Compose Changes

### `docker-compose.ec2.yml`
- Uses pre-built images from GitHub Container Registry
- Memory limits for EC2 t2.micro (1GB RAM)
- No volume mounts (production images)
- Restart policies enabled

**Key differences from dev:**
```yaml
# Development (docker-compose.yml)
volumes:
  - ./frontend/src:/app/src  # Hot reload
ports:
  - "3000:3000"  # Vite dev server

# Production (docker-compose.ec2.yml)
# No volumes - code baked into image
ports:
  - "80:80"  # Nginx serves static files
mem_limit: 128m  # Memory constraint
```

---

## Deployment Workflow

### Local Development
```bash
docker compose up --build
# Access: http://localhost:3000
```

### AWS EC2 Production
```bash
# Pull latest code
cd ~/Cattle_Management_App
git pull

# Rebuild frontend with fixed API URL
cd frontend
docker build --no-cache -f Dockerfile.prod -t ghcr.io/mudhazhiedu/cattle_management_app-frontend:latest .

# Deploy
cd ~/Cattle_Management_App
docker-compose -f docker-compose.ec2.yml up -d

# Access: http://YOUR_EC2_IP
```

---

## Troubleshooting

### Issue: Empty table, no cow data
**Cause:** Browser cached old JavaScript with `localhost:5000` URL

**Solution:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear cache: `Ctrl + Shift + Delete`
3. Or use Incognito mode

### Issue: API calls fail
**Check nginx proxy:**
```bash
curl http://localhost/api/cows
docker logs cattle_frontend
```

### Issue: Frontend not updated
**Force rebuild:**
```bash
cd ~/Cattle_Management_App/frontend
rm -rf dist node_modules
docker build --no-cache -f Dockerfile.prod -t ghcr.io/mudhazhiedu/cattle_management_app-frontend:latest .
cd ~/Cattle_Management_App
docker-compose -f docker-compose.ec2.yml up -d
```

---

## Security Considerations

### Production Checklist
- ✅ No hardcoded localhost URLs
- ✅ API proxied through nginx (no CORS issues)
- ✅ Secure passwords in `.env` (not committed)
- ✅ JWT secret randomized
- ⚠️ TODO: Add HTTPS with Let's Encrypt
- ⚠️ TODO: Restrict security group to specific IPs
- ⚠️ TODO: Add rate limiting in nginx

---

## Future Improvements

1. **HTTPS/SSL:**
   - Use Let's Encrypt with certbot
   - Update nginx config for SSL

2. **Domain Name:**
   - Register domain (e.g., cattle-app.com)
   - Point to EC2 IP
   - Update nginx server_name

3. **CI/CD:**
   - GitHub Actions builds images on push
   - Auto-deploy to EC2 via SSH
   - Blue-green deployment

4. **Monitoring:**
   - CloudWatch logs
   - Prometheus + Grafana
   - Error tracking (Sentry)

---

## Summary

**What changed:**
- Frontend API calls: `http://localhost:5000/api` → `/api`
- Added nginx reverse proxy
- Production Dockerfile with multi-stage build
- Removed environment variable dependency

**Why:**
- Works in any environment (local, EC2, cloud)
- No CORS issues
- Browser cache-friendly
- Production-ready architecture
