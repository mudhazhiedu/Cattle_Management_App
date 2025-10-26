# AWS EC2 Free Tier Deployment Guide

## Prerequisites
- AWS account with free tier eligibility
- EC2 instance: t2.micro (1GB RAM, 1 vCPU)
- Amazon Linux 2 AMI

## Quick Deploy (5 minutes)

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Amazon Linux 2 AMI**
3. Select **t2.micro** (Free tier eligible)
4. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (80) - 0.0.0.0/0
   - Custom TCP (5000) - 0.0.0.0/0
5. Create/select key pair
6. Launch instance

### Step 2: Connect to EC2
```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### Step 3: Run Deployment Script
```bash
curl -o deploy.sh https://raw.githubusercontent.com/mudhazhiedu/Cattle_Management_App/main/deploy-ec2.sh
chmod +x deploy.sh
./deploy.sh
```

### Step 4: Access Application
```
http://your-ec2-public-ip
```

## Manual Deployment

### 1. Install Docker
```bash
sudo yum update -y
sudo yum install -y docker git
sudo service docker start
sudo usermod -a -G docker ec2-user
```

### 2. Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Clone & Configure
```bash
git clone https://github.com/mudhazhiedu/Cattle_Management_App.git
cd Cattle_Management_App
cp .env.example .env
nano .env  # Edit passwords
```

### 4. Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 5. Verify
```bash
docker ps
docker-compose -f docker-compose.prod.yml logs -f
```

## Memory Optimization for Free Tier

The production compose file limits:
- PostgreSQL: 256MB
- Backend: 256MB
- Frontend: 128MB
- Total: ~640MB (fits in 1GB with OS overhead)

## Troubleshooting

**Out of memory:**
```bash
# Add swap space
sudo dd if=/dev/zero of=/swapfile bs=128M count=8
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**Port conflicts:**
```bash
sudo netstat -tulpn | grep :80
sudo kill -9 <PID>
```

**Restart services:**
```bash
docker-compose -f docker-compose.prod.yml restart
```

## Update Application
```bash
cd ~/Cattle_Management_App
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

## Stop Application
```bash
docker-compose -f docker-compose.prod.yml down
```

## Backup Database
```bash
docker exec cattle_db pg_dump -U cattle_admin cattle_management_db > backup.sql
```
