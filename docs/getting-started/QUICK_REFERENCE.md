# Quick Reference Card

## 🔗 Access

**Production URL:** http://98.90.190.211  
**Default Login:** admin / admin123

## 👥 User Roles

| Feature | Admin | User |
|---------|-------|------|
| View cows | ✅ | ✅ |
| Add/Edit/Delete cows | ✅ | ❌ |
| Record milking | ✅ | ✅ |
| Record breeding | ✅ | ✅ |
| Create users | ✅ | ❌ |

## 🚀 Deploy Commands

```bash
# Quick deploy (recommended)
ssh -i key.pem ec2-user@98.90.190.211
cd Cattle_Management_App
git pull && docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
```

## 🔑 API Endpoints

```bash
# Login
POST /api/auth/login
Body: {"username": "admin", "password": "admin123"}

# Get cows
GET /api/cows

# Add cow (admin only)
POST /api/cows
Headers: Authorization: Bearer <token>

# Record milking
POST /api/milking
Headers: Authorization: Bearer <token>

# Record heat
POST /api/breeding/heat
Headers: Authorization: Bearer <token>
```

## 🗄️ Database

```bash
# Connect
docker compose exec postgres psql -U cattle_user cattle_db

# View users
SELECT username, role FROM users;

# Backup
docker compose exec postgres pg_dump -U cattle_user cattle_db > backup.sql
```

## 📊 Key Tables

- **users** - User accounts (admin/user)
- **cows** - Cattle inventory
- **milking_records** - Daily milk production
- **heat_records** - Heat detection
- **ai_records** - Artificial insemination
- **pregnancy_records** - Pregnancy checks
- **calving_records** - Birth events

## 🛠️ Troubleshooting

```bash
# Check logs
docker compose -f docker-compose.ec2.yml logs -f

# Restart services
docker compose -f docker-compose.ec2.yml restart

# Check status
docker compose -f docker-compose.ec2.yml ps
```

## 📚 Documentation

- **README.md** - Quick start
- **API.md** - API reference
- **DATABASE.md** - Schema docs
- **USER_GUIDE.md** - User manual
- **DEPLOYMENT_GUIDE.md** - Deploy instructions
- **CHANGELOG.md** - Version history

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET in .env
- [ ] Set up HTTPS/SSL
- [ ] Configure database backups
- [ ] Create worker user accounts

## 📞 Common Tasks

### Create New User
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# Create user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"worker1","password":"pass123","fullName":"John Worker","role":"user"}'
```

### Backup Database
```bash
docker compose -f docker-compose.ec2.yml exec postgres \
  pg_dump -U cattle_user cattle_db > backup_$(date +%Y%m%d).sql
```

### View Recent Logs
```bash
docker compose -f docker-compose.ec2.yml logs --tail=50 backend
```

---

**Need Help?** Check USER_GUIDE.md for detailed instructions.
