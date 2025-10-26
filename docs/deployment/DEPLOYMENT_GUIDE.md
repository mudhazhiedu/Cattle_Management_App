# Deployment Guide - Phase 3 Update

## What's New in Phase 3

1. **Authentication System**: Login required, JWT tokens, admin/user roles
2. **Documentation**: API.md, DATABASE.md, CHANGELOG.md, USER_GUIDE.md
3. **Role-Based Access**: Admin can CRUD cows, users can only view and record data

## Deploy to EC2

### Option 1: Quick Deploy (Recommended)

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@98.90.190.211

# Navigate to project
cd Cattle_Management_App

# Pull latest code
git pull origin main

# Pull latest images from GitHub Container Registry
docker compose -f docker-compose.ec2.yml pull

# Restart services
docker compose -f docker-compose.ec2.yml up -d

# Check logs
docker compose -f docker-compose.ec2.yml logs -f
```

### Option 2: Build on EC2 (Slower)

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@98.90.190.211

# Navigate to project
cd Cattle_Management_App

# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.ec2.yml up -d --build

# Check logs
docker compose -f docker-compose.ec2.yml logs -f
```

## First Time Setup

### Update Environment Variables

```bash
# Edit .env file on EC2
nano .env

# Update JWT_SECRET (IMPORTANT for production)
JWT_SECRET=your-secure-random-secret-key-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**IMPORTANT:** Change the default password after first login!

## Post-Deployment Verification

1. **Check Services:**
```bash
docker compose -f docker-compose.ec2.yml ps
```

All services should show "Up" status.

2. **Test Backend:**
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","service":"Cattle Management API"}`

3. **Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Should return a JWT token and user object.

4. **Access Frontend:**
Open browser: http://98.90.190.211

You should see the login page.

## Creating Additional Users

### Via API (Admin Only)

```bash
# Get admin token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# Create new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "worker1",
    "password": "password123",
    "fullName": "John Worker",
    "role": "user"
  }'
```

### Via Database (Direct)

```bash
# Connect to database
docker compose -f docker-compose.ec2.yml exec postgres psql -U cattle_user cattle_db

# Check existing users
SELECT id, username, "fullName", role FROM users;

# Note: Passwords must be bcrypt hashed, use API method instead
```

## User Roles

### Admin Role
- Full access to all features
- Can add, edit, delete cows
- Can create new user accounts
- Can delete any records

### User Role (Farm Workers)
- View all cows and details
- Record milking data
- Record breeding events
- Cannot delete cows or records
- Cannot create user accounts

## Troubleshooting

### Login Not Working

1. Check backend logs:
```bash
docker compose -f docker-compose.ec2.yml logs backend
```

2. Verify database has users table:
```bash
docker compose -f docker-compose.ec2.yml exec postgres psql -U cattle_user cattle_db -c "\dt"
```

3. Check if admin user exists:
```bash
docker compose -f docker-compose.ec2.yml exec postgres psql -U cattle_user cattle_db -c "SELECT * FROM users;"
```

### "No token provided" Error

- Frontend not sending token
- Check browser localStorage for 'token' key
- Clear browser cache and login again

### "Admin access required" Error

- User role is 'user' but trying admin operation
- Login with admin account
- Check user role in database

### Database Connection Issues

```bash
# Restart database
docker compose -f docker-compose.ec2.yml restart postgres

# Check database logs
docker compose -f docker-compose.ec2.yml logs postgres
```

## Security Recommendations

1. **Change Default Password:**
   - Login as admin
   - Change password immediately

2. **Update JWT Secret:**
   - Generate secure random key
   - Update in .env file
   - Restart backend

3. **Use HTTPS:**
   - Install SSL certificate (Let's Encrypt)
   - Configure nginx for HTTPS
   - Redirect HTTP to HTTPS

4. **Regular Backups:**
```bash
# Backup database
docker compose -f docker-compose.ec2.yml exec postgres pg_dump -U cattle_user cattle_db > backup_$(date +%Y%m%d).sql

# Backup to S3 (optional)
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-bucket/backups/
```

5. **Monitor Logs:**
```bash
# Watch for suspicious activity
docker compose -f docker-compose.ec2.yml logs -f backend | grep -i "401\|403\|error"
```

## Rollback (If Issues)

```bash
# Stop services
docker compose -f docker-compose.ec2.yml down

# Checkout previous version
git checkout 12406d7  # Phase 2 commit

# Restart
docker compose -f docker-compose.ec2.yml up -d
```

## Support

- **API Documentation**: See API.md
- **Database Schema**: See DATABASE.md
- **User Manual**: See USER_GUIDE.md
- **Version History**: See CHANGELOG.md
