# EC2 Deployment - Complete Step-by-Step Guide

## Part 1: Create EC2 Instance (AWS Console)

### Step 1: Login to AWS
1. Go to https://aws.amazon.com/console/
2. Sign in to your account
3. Select region (e.g., US East N. Virginia)

### Step 2: Launch EC2 Instance
1. Search for "EC2" in top search bar
2. Click **"Launch Instance"** (orange button)

### Step 3: Configure Instance

**Name:**
```
cattle-management-app
```

**Application and OS Images (AMI):**
- Select: **Amazon Linux 2023 AMI** (Free tier eligible)
- Architecture: **64-bit (x86)**

**Instance type:**
- Select: **t2.micro** (Free tier eligible: 1 vCPU, 1 GiB Memory)

**Key pair (login):**
- Click **"Create new key pair"**
- Key pair name: `cattle-app-key`
- Key pair type: **RSA**
- Private key format: **.pem** (for Mac/Linux) or **.ppk** (for Windows PuTTY)
- Click **"Create key pair"** → File downloads automatically
- **SAVE THIS FILE** - you cannot download it again

**Network settings:**
Click **"Edit"** and configure:

1. **Auto-assign public IP:** Enable
2. **Firewall (security groups):** Create security group
3. **Security group name:** `cattle-app-sg`
4. **Description:** `Security group for Cattle Management App`

**Add these rules:**

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web access |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 | API access |

To add rules:
- Click **"Add security group rule"** for each
- Select type from dropdown
- Source: Choose "My IP" for SSH, "Anywhere" (0.0.0.0/0) for HTTP and 5000

**Configure storage:**
- **Size:** 8 GiB (default, free tier allows up to 30 GiB)
- **Volume type:** gp3 (General Purpose SSD)

**Advanced details:**
- Leave as default

### Step 4: Launch
1. Review summary on right side
2. Click **"Launch instance"** (orange button)
3. Wait 30 seconds
4. Click **"View all instances"**

### Step 5: Get Instance Details
1. Select your instance (checkbox)
2. Note down:
   - **Public IPv4 address** (e.g., 3.85.123.45)
   - **Instance state** should be "Running" (green)

---

## Part 2: Connect to EC2 Instance

### For Mac/Linux:

**Step 1: Set key permissions**
```bash
cd ~/Downloads
chmod 400 cattle-app-key.pem
```

**Step 2: Connect via SSH**
```bash
ssh -i cattle-app-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```
Replace `YOUR_EC2_PUBLIC_IP` with your actual IP (e.g., 3.85.123.45)

**Step 3: Type "yes" when prompted**
```
Are you sure you want to continue connecting (yes/no)? yes
```

### For Windows:

**Option A: Use PowerShell/CMD**
```cmd
ssh -i cattle-app-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

**Option B: Use PuTTY**
1. Download PuTTY from https://www.putty.org/
2. Convert .pem to .ppk using PuTTYgen
3. Use .ppk file in PuTTY to connect

---

## Part 3: Deploy Application on EC2

### Method 1: Automated (Recommended)

**Once connected to EC2, run:**
```bash
curl -o deploy.sh https://raw.githubusercontent.com/mudhazhiedu/Cattle_Management_App/main/deploy-ec2.sh
chmod +x deploy.sh
./deploy.sh
```

**Wait 5-10 minutes** for:
- System updates
- Docker installation
- Docker Compose installation
- Repository clone
- Image download
- Container startup

### Method 2: Manual (Step-by-step)

**Step 1: Update system**
```bash
sudo yum update -y
```

**Step 2: Install Docker**
```bash
sudo yum install -y docker git
sudo service docker start
sudo usermod -a -G docker ec2-user
```

**Step 3: Logout and login again**
```bash
exit
```
Then reconnect via SSH (same command as before)

**Step 4: Install Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

**Step 5: Clone repository**
```bash
cd ~
git clone https://github.com/mudhazhiedu/Cattle_Management_App.git
cd Cattle_Management_App
```

**Step 6: Configure environment**
```bash
cp .env.example .env
nano .env
```

Edit these values:
- Change `DB_PASSWORD=change_me` to a strong password
- Change `JWT_SECRET=change_this_jwt_secret` to a random string
- Press `Ctrl+X`, then `Y`, then `Enter` to save

**Step 7: Deploy**
```bash
docker-compose -f docker-compose.ec2.yml pull
docker-compose -f docker-compose.ec2.yml up -d
```

**Step 7b: If frontend doesn't load (shows connection reset):**
```bash
cd ~/Cattle_Management_App/frontend
docker build -f Dockerfile.prod -t ghcr.io/mudhazhiedu/cattle_management_app-frontend:latest .
cd ~/Cattle_Management_App
docker-compose -f docker-compose.ec2.yml up -d
```

**Step 8: Verify deployment**
```bash
docker ps
```
You should see 3 containers running:
- cattle_db (postgres)
- cattle_backend (node)
- cattle_frontend (nginx)

---

## Part 4: Access Your Application

### Get your public IP:
```bash
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

### Access in browser:
```
http://YOUR_EC2_PUBLIC_IP
```

Example: `http://3.85.123.45`

---

## Part 5: Verify Everything Works

### Check container status:
```bash
docker ps
```

### View logs:
```bash
# All services
docker-compose -f docker-compose.ec2.yml logs -f

# Specific service
docker logs cattle_backend
docker logs cattle_frontend
docker logs cattle_db
```

### Seed sample data:
```bash
docker exec cattle_backend npm run seed
```

### Test API:
```bash
curl http://localhost:5000/health
```

---

## Common Issues & Solutions

### Issue 1: "Permission denied" when connecting
```bash
chmod 400 cattle-app-key.pem
```

### Issue 2: "Connection refused"
- Check security group allows port 22 from your IP
- Verify instance is running in AWS console

### Issue 3: "Cannot connect to Docker daemon"
```bash
sudo service docker start
sudo usermod -a -G docker ec2-user
exit
# Reconnect via SSH
```

### Issue 4: Out of memory
```bash
# Add swap space
sudo dd if=/dev/zero of=/swapfile bs=128M count=8
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

### Issue 5: Port 80 already in use
```bash
sudo netstat -tulpn | grep :80
sudo systemctl stop httpd  # If Apache is running
```

### Issue 6: Frontend shows empty table (no cow data)
```bash
# Pull latest code with fixed nginx config
cd ~/Cattle_Management_App
git pull
cd frontend
docker build -f Dockerfile.prod -t ghcr.io/mudhazhiedu/cattle_management_app-frontend:latest .
cd ~/Cattle_Management_App
docker-compose -f docker-compose.ec2.yml up -d

# Wait 1 minute, refresh browser with Ctrl+F5
```

### Issue 7: Windows SSH key permissions error
```powershell
cd Downloads
icacls cattle_prj.pem /inheritance:r
icacls cattle_prj.pem /grant:r "YOUR_USERNAME:R"
ssh -i cattle_prj.pem ec2-user@YOUR_EC2_IP
```

Or use **EC2 Instance Connect** in AWS Console (no key needed)

---

## Useful Commands

### Restart application:
```bash
cd ~/Cattle_Management_App
docker-compose -f docker-compose.ec2.yml restart
```

### Stop application:
```bash
docker-compose -f docker-compose.ec2.yml down
```

### Update application:
```bash
cd ~/Cattle_Management_App
git pull
docker-compose -f docker-compose.ec2.yml pull
docker-compose -f docker-compose.ec2.yml up -d
```

### Backup database:
```bash
docker exec cattle_db pg_dump -U cattle_admin cattle_management_db > backup_$(date +%Y%m%d).sql
```

### View resource usage:
```bash
docker stats
```

---

## Cost Monitoring

**Free tier includes:**
- 750 hours/month of t2.micro (enough for 1 instance running 24/7)
- 30 GB of EBS storage
- 15 GB of bandwidth out

**To avoid charges:**
- Stop instance when not in use (AWS Console → EC2 → Instance → Stop)
- Delete instance after testing (Instance → Terminate)

---

## Next Steps

1. ✅ Access application at `http://YOUR_EC2_IP`
2. ✅ Seed sample data: `docker exec cattle_backend npm run seed`
3. ✅ Test cow management features
4. 🔒 Optional: Setup domain name and SSL certificate
5. 📊 Optional: Setup monitoring and backups
