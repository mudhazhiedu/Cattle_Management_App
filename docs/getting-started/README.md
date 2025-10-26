# Getting Started

Quick start guides and essential references.

## Documents

### [Quick Reference](./QUICK_REFERENCE.md)
Essential commands, API endpoints, and common tasks. Keep this handy!

**Contents:**
- Access URLs and login credentials
- User roles and permissions
- API endpoints cheat sheet
- Database commands
- Deployment commands
- Troubleshooting tips

**Best for:** Quick lookups, daily operations

---

### [Seed Data Guide](./SEED_DATA_README.md)
Load realistic sample data for testing, demos, and validation.

**Contents:**
- What data gets created (25 cows, 2 years, ~6,500 records)
- How to run the seed script
- Expected results and metrics
- Validation checklist
- Troubleshooting

**Best for:** Testing, demos, training, validation

---

## Quick Start

### 1. First Time Setup
```bash
# Clone and start
git clone <repo>
cd Cattle_Management_App
cp .env.example .env
docker compose up -d

# Load sample data
docker compose exec backend npm run seed:farm
```

### 2. Access System
- **URL:** http://localhost:3000
- **Login:** admin / admin123

### 3. Explore
- Dashboard → See farm overview
- Cows → Click any cow for complete lifecycle
- Try all 6 modules

---

## Next Steps

- **Learn to use:** [User Guide](../user-guide/USER_GUIDE.md)
- **Deploy to production:** [Deployment Guide](../deployment/EC2_STEP_BY_STEP.md)
- **Integrate with API:** [API Documentation](../api-reference/API.md)
