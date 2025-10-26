# Cattle Management App

Docker-first cattle farm management system with Express backend, React frontend, and PostgreSQL.

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

## Features

- Cow management (CRUD)
- Milking records tracking
- PostgreSQL database
- Docker containerized
- CI/CD with GitHub Actions

## Environment Variables

See `.env.example` for required configuration.

## Deployment

Images are automatically built and pushed to `ghcr.io/mudhazhiedu` on push to main.
