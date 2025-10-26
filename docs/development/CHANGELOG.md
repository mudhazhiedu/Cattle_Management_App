# Changelog

All notable changes to the Cattle Management App.

## [Unreleased]

### Phase 3: Authentication & User Management
- User authentication with JWT tokens
- Role-based access control (Admin/User)
- Login page
- Protected routes and API endpoints
- Admin-only operations (delete, user management)

---

## [0.2.0] - 2024-01-15

### Phase 2: Breeding Module

#### Added
- **Heat Detection**: Record and track heat cycles
  - Heat intensity levels (weak, moderate, strong)
  - Detection date tracking
  - Behavioral notes
  
- **AI Records**: Artificial insemination tracking
  - AI procedure dates
  - Bull identification
  - Technician information
  - Procedure notes
  
- **Pregnancy Tracking**: Pregnancy check management
  - Pregnancy status (confirmed, not_pregnant, uncertain)
  - Expected calving date calculation
  - Veterinary notes
  
- **Calving Records**: Birth event documentation
  - Calving date
  - Calf gender and tag number
  - Difficulty level (easy, normal, difficult, assisted)
  - Calving notes

#### Backend
- Created 4 new Sequelize models: HeatRecord, AIRecord, PregnancyRecord, CalvingRecord
- Added breeding routes at `/api/breeding/*`
- Implemented CRUD endpoints for all breeding records
- Added model associations linking breeding records to cows

#### Frontend
- Created BreedingManagement page with 4 tabs
- Built HeatForm and AIForm components
- Added breeding tables with Material-UI DataGrid
- Added "Breeding" navigation link
- Integrated date-fns for date formatting

#### Database
- Added 4 new tables: heat_records, ai_records, pregnancy_records, calving_records
- Foreign key relationships to cows table with CASCADE DELETE

---

## [0.1.0] - 2024-01-10

### Phase 1: MVP - Core Cattle Management

#### Added
- **Cow Management**: Full CRUD operations
  - Add, edit, delete cows
  - Track tag number, name, breed, DOB, gender
  - Status management (active, sold, deceased)
  - Purchase information and current value
  
- **Dashboard**: Farm overview
  - Total active cows count
  - Average daily milk production
  - Total milk this month
  - Recent milking records table
  
- **Milking Records**: Daily milk production tracking
  - Morning and evening yield entry
  - Automatic total calculation
  - Date-based filtering
  - Notes for quality observations
  
- **Cow Detail Page**: Individual cow view
  - Complete cow information
  - Milking history table
  - Edit and delete actions
  - Navigation between cows

#### Backend
- Express.js REST API
- Sequelize ORM with PostgreSQL
- Models: Cow, MilkingRecord
- Routes: `/api/cows`, `/api/milking`
- CORS configuration
- Error handling middleware

#### Frontend
- React 18 with Vite
- Material-UI component library
- React Router for navigation
- Axios for API calls
- Feature-based folder structure
- Responsive layout with navigation bar

#### Infrastructure
- Docker Compose setup (development)
- PostgreSQL 15 database
- Multi-stage Docker builds
- Nginx reverse proxy for production
- Environment variable configuration

#### Deployment
- AWS EC2 t2.micro (free tier)
- Elastic IP: 98.90.190.211
- Amazon Linux 2023
- Docker + Docker Compose
- Memory-optimized containers (256MB backend, 256MB postgres, 128MB frontend)
- GitHub Actions CI/CD
- Container images pushed to ghcr.io/mudhazhiedu

#### Documentation
- README.md with quick start guide
- EC2_DEPLOYMENT.md with deployment instructions
- .env.example for configuration
- Docker setup for development and production

---

## [0.0.1] - 2024-01-05

### Initial Setup
- Project structure created
- Git repository initialized
- Basic Docker configuration
- Database schema design
