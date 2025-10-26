#!/bin/bash
set -e

echo "🚀 Deploying Cattle Management App to EC2..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
cd ~
git clone https://github.com/mudhazhiedu/Cattle_Management_App.git
cd Cattle_Management_App

# Setup environment
cp .env.example .env
sed -i 's/change_me/'"$(openssl rand -base64 32)"'/g' .env
sed -i 's/change_this_jwt_secret/'"$(openssl rand -base64 32)"'/g' .env

# Pull and start pre-built images
docker-compose -f docker-compose.ec2.yml pull
docker-compose -f docker-compose.ec2.yml up -d

echo "✅ Deployment complete!"
echo "Access your app at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
