# Deployment Documentation

Guides for deploying to various environments.

## Documents

### [EC2 Step-by-Step](./EC2_STEP_BY_STEP.md) ⭐ Recommended
Complete guide for deploying to AWS EC2 free tier.

**Contents:**
- EC2 instance setup
- Docker installation
- Application deployment
- Nginx configuration
- SSL setup (optional)
- Troubleshooting

**Best for:** First-time deployment

---

### [EC2 Deployment](./EC2_DEPLOYMENT.md)
Quick reference for EC2 deployment.

**Contents:**
- Quick deploy commands
- Environment variables
- GitHub Actions setup

**Best for:** Quick reference, updates

---

### [Deployment Guide](./DEPLOYMENT_GUIDE.md)
General deployment instructions for Phase 3.

**Contents:**
- Post-deployment verification
- Security recommendations
- Backup procedures
- Rollback plan

---

### [Deployment Changes](./DEPLOYMENT_CHANGES.md)
Recent deployment-related changes and updates.

---

### [Phase 4 Deployment](./DEPLOY_PHASE4.md)
Specific instructions for deploying Phase 4 features.

**Contents:**
- New database tables
- API endpoint verification
- Feature testing checklist

---

## Quick Deploy

### Production (EC2)
```bash
ssh -i your-key.pem ec2-user@98.90.190.211
cd Cattle_Management_App
git pull origin main
docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
```

### Development (Local)
```bash
git pull origin main
docker compose up -d --build
```

---

## Deployment Checklist

### Before Deployment:
- [ ] Review [Changelog](../development/CHANGELOG.md)
- [ ] Backup database
- [ ] Test locally
- [ ] Update .env if needed

### After Deployment:
- [ ] Verify services running
- [ ] Test API endpoints
- [ ] Check frontend loads
- [ ] Verify database migrations
- [ ] Test critical features

### Post-Deployment:
- [ ] Monitor logs for errors
- [ ] Test with real users
- [ ] Document any issues
- [ ] Update documentation

---

## Environments

### Production
- **URL:** http://98.90.190.211
- **Server:** AWS EC2 t2.micro (Amazon Linux 2023)
- **Docker:** docker-compose.ec2.yml
- **Memory:** Optimized for 1GB RAM

### Development
- **URL:** http://localhost:3000
- **Docker:** docker-compose.yml
- **Hot Reload:** Enabled

---

## Troubleshooting

### Services won't start
```bash
docker compose -f docker-compose.ec2.yml logs
docker compose -f docker-compose.ec2.yml restart
```

### Database issues
```bash
docker compose -f docker-compose.ec2.yml exec postgres psql -U cattle_user cattle_db
```

### Frontend not updating
```bash
docker compose -f docker-compose.ec2.yml up -d --build cattle_frontend --no-cache
```

### Out of memory
```bash
# Check memory
free -h

# Restart services one by one
docker compose -f docker-compose.ec2.yml restart postgres
docker compose -f docker-compose.ec2.yml restart backend
docker compose -f docker-compose.ec2.yml restart cattle_frontend
```

---

## Security

### Production Checklist:
- [ ] Change default admin password
- [ ] Update JWT_SECRET in .env
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up automated backups
- [ ] Restrict database access

### Backup
```bash
# Manual backup
docker compose -f docker-compose.ec2.yml exec postgres pg_dump -U cattle_user cattle_db > backup.sql

# Restore
docker compose -f docker-compose.ec2.yml exec -T postgres psql -U cattle_user cattle_db < backup.sql
```

---

## CI/CD

GitHub Actions automatically:
1. Builds Docker images on push to main
2. Pushes to ghcr.io/mudhazhiedu
3. Available for pull on EC2

**Setup:**
1. Repository Settings → Actions → General
2. Enable "Read and write permissions"
3. Push to main triggers build

---

## Support

- **Deployment Issues:** Check logs first
- **Performance:** See [EC2 Step-by-Step](./EC2_STEP_BY_STEP.md)
- **Updates:** Follow [Deployment Guide](./DEPLOYMENT_GUIDE.md)
