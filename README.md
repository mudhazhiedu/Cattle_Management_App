# 🐄 Cattle Management System

Modern, open-source cattle farm management platform with complete lifecycle tracking.

**Production URL:** http://98.90.190.211  
**Status:** 75% Complete | Production Ready  
**Version:** 0.5.0 (Phase 5)

## Quick Start

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

## Project Structure

```
├── backend/          # Express API + Sequelize
├── frontend/         # React + Vite
├── database/         # SQL schema
├── docker-compose.yml
└── .env.example
```

## Development

```bash
# View logs
docker compose logs -f

# Seed sample data
docker compose exec backend npm run seed

# Stop services
docker compose down
```

## ✨ Features

### Core Modules (Complete)
- 🐄 **Cow Management** - Complete lifecycle tracking with 6-tab detail view
- 🥛 **Milking Records** - Daily production with quality metrics (SCC, fat %, protein %)
- 💕 **Breeding Module** - Heat detection, AI, pregnancy tracking, calving records
- 🏥 **Health Management** - Vaccinations, treatments, medications with withdrawal tracking
- 💰 **Financial Tracking** - Income/expense with auto-integration
- 🌾 **Feed Management** - Inventory, consumption, cost per cow
- 🔔 **Smart Reminders** - Auto-generated from breeding/health events
- 👥 **Multi-user** - Role-based access (Admin/Worker)

### Key Advantages
- ✅ **Auto-Interconnectivity** - One action updates multiple modules
- ✅ **Cattle-Focused** - Not diluted with crops/other animals
- ✅ **Free & Open Source** - No licensing fees ($0 vs $240-480/year)
- ✅ **Modern Tech** - React, Express, PostgreSQL, Docker
- ✅ **Self-Hosted** - Complete data control

## 📚 Documentation

**[Complete Documentation →](./docs/)**

### Quick Links:
- 🚀 [Quick Reference](./docs/getting-started/QUICK_REFERENCE.md) - Commands and common tasks
- 👥 [User Guide](./docs/user-guide/USER_GUIDE.md) - How to use all features
- 🔧 [API Documentation](./docs/api-reference/API.md) - All endpoints
- 🗄️ [Database Schema](./docs/api-reference/DATABASE.md) - Complete schema
- 🚀 [Deployment Guide](./docs/deployment/EC2_STEP_BY_STEP.md) - Deploy to AWS EC2
- 🌱 [Seed Data](./docs/getting-started/SEED_DATA_README.md) - Load sample data
- ✅ [Validation Guide](./docs/development/VALIDATION_GUIDE.md) - Test the system

## 🚀 Quick Deploy to Production

```bash
ssh -i your-key.pem ec2-user@98.90.190.211
cd Cattle_Management_App
git pull origin main
docker compose -f docker-compose.ec2.yml pull
docker compose -f docker-compose.ec2.yml up -d
```

## 🌱 Load Sample Data

```bash
# Load 25 cows with 2 years of data (~6,500 records)
docker compose exec backend npm run seed:farm

# Login: admin / admin123
```

## 📊 Current Progress

- ✅ Phase 1: MVP (Cow Management + Milking)
- ✅ Phase 2: Breeding Module
- ✅ Phase 3: Authentication & Documentation
- ✅ Phase 4: Health, Financial, Reminders
- ✅ Phase 5: Interconnectivity + Feed Management
- 🔄 Phase 6: Validation & Testing (Current)

**Feature Completion:** 75% of blueprint  
**See:** [Progress Analysis](./docs/development/PROGRESS_ANALYSIS.md)

## 🏆 vs. Competition

| Feature | FarmOS | Tania | ERPNext | CattleMax | **Our App** |
|---------|--------|-------|---------|-----------|-------------|
| Cattle Focus | 70% | 40% | 60% | 95% | **90%** ✅ |
| Ease of Use | 60% | 70% | 40% | 85% | **90%** ✅ |
| Cost | Free | Free | Free | $240-480/yr | **Free** ✅ |
| Auto-Integration | 50% | 30% | 60% | 70% | **95%** ✅ |

**See:** [Full Comparison](./docs/analysis/OSS_COMPARISON_ANALYSIS.md)

## 🤝 Contributing

See [development docs](./docs/development/) for contribution guidelines.

## 📄 License

Open source - MIT License
