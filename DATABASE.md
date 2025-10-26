# Database Schema

PostgreSQL database with 7 main tables.

## Entity Relationships

```
Users (1) ──────────────────┐
                             │
Cows (1) ─────┬──────────────┼─── (many) MilkingRecords
              │              │
              ├──────────────┼─── (many) HeatRecords
              │              │
              ├──────────────┼─── (many) AIRecords
              │              │
              ├──────────────┼─── (many) PregnancyRecords
              │              │
              └──────────────┴─── (many) CalvingRecords
```

## Tables

### users
User accounts with role-based access.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| fullName | VARCHAR(100) | NOT NULL | Full name |
| role | ENUM | NOT NULL | 'admin' or 'user' |
| createdAt | TIMESTAMP | NOT NULL | Account creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `username`

---

### cows
Main cattle inventory.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| tagNumber | VARCHAR(50) | UNIQUE, NOT NULL | Unique ear tag number |
| name | VARCHAR(100) | | Cow name |
| breed | VARCHAR(50) | | Breed (Holstein, Jersey, etc.) |
| dateOfBirth | DATE | | Birth date |
| gender | ENUM | NOT NULL | 'Male' or 'Female' |
| status | ENUM | DEFAULT 'active' | 'active', 'sold', 'deceased' |
| purchaseDate | DATE | | Date acquired |
| purchasePrice | DECIMAL(10,2) | | Purchase price |
| currentValue | DECIMAL(10,2) | | Current estimated value |
| notes | TEXT | | Additional notes |
| createdAt | TIMESTAMP | NOT NULL | Record creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `tagNumber`
- INDEX on `status`

---

### milking_records
Daily milk production tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| cowId | INTEGER | FOREIGN KEY, NOT NULL | References cows(id) |
| date | DATE | NOT NULL | Milking date |
| morningYield | DECIMAL(5,2) | | Morning milk (liters) |
| eveningYield | DECIMAL(5,2) | | Evening milk (liters) |
| totalYield | DECIMAL(5,2) | | Total daily milk (liters) |
| notes | TEXT | | Quality notes, observations |
| createdAt | TIMESTAMP | NOT NULL | Record creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `cowId` → cows(id) CASCADE DELETE
- INDEX on `date`
- INDEX on `cowId, date`

---

### heat_records
Heat detection for breeding management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| cowId | INTEGER | FOREIGN KEY, NOT NULL | References cows(id) |
| detectedDate | DATE | NOT NULL | Heat detection date |
| intensity | ENUM | | 'weak', 'moderate', 'strong' |
| notes | TEXT | | Behavioral observations |
| createdAt | TIMESTAMP | NOT NULL | Record creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `cowId` → cows(id) CASCADE DELETE
- INDEX on `detectedDate`

---

### ai_records
Artificial insemination records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| cowId | INTEGER | FOREIGN KEY, NOT NULL | References cows(id) |
| aiDate | DATE | NOT NULL | AI procedure date |
| bullId | VARCHAR(50) | | Bull identification |
| technician | VARCHAR(100) | | Technician name |
| notes | TEXT | | Procedure notes |
| createdAt | TIMESTAMP | NOT NULL | Record creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `cowId` → cows(id) CASCADE DELETE
- INDEX on `aiDate`

---

### pregnancy_records
Pregnancy check results.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| cowId | INTEGER | FOREIGN KEY, NOT NULL | References cows(id) |
| checkDate | DATE | NOT NULL | Pregnancy check date |
| status | ENUM | NOT NULL | 'confirmed', 'not_pregnant', 'uncertain' |
| expectedCalvingDate | DATE | | Expected calving date |
| notes | TEXT | | Veterinary notes |
| createdAt | TIMESTAMP | NOT NULL | Record creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `cowId` → cows(id) CASCADE DELETE
- INDEX on `checkDate`
- INDEX on `status`

---

### calving_records
Calving event records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| cowId | INTEGER | FOREIGN KEY, NOT NULL | References cows(id) (mother) |
| calvingDate | DATE | NOT NULL | Calving date |
| calfGender | ENUM | | 'Male' or 'Female' |
| calfTagNumber | VARCHAR(50) | | New calf tag number |
| difficulty | ENUM | | 'easy', 'normal', 'difficult', 'assisted' |
| notes | TEXT | | Calving notes |
| createdAt | TIMESTAMP | NOT NULL | Record creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `cowId` → cows(id) CASCADE DELETE
- INDEX on `calvingDate`

---

## Common Queries

### Get cow with all breeding history
```sql
SELECT c.*, 
  (SELECT json_agg(h.*) FROM heat_records h WHERE h.cowId = c.id) as heat_records,
  (SELECT json_agg(a.*) FROM ai_records a WHERE a.cowId = c.id) as ai_records,
  (SELECT json_agg(p.*) FROM pregnancy_records p WHERE p.cowId = c.id) as pregnancy_records,
  (SELECT json_agg(cal.*) FROM calving_records cal WHERE cal.cowId = c.id) as calving_records
FROM cows c
WHERE c.id = 1;
```

### Get total milk production by cow
```sql
SELECT c.tagNumber, c.name, 
  SUM(m.totalYield) as total_milk,
  AVG(m.totalYield) as avg_daily_milk,
  COUNT(m.id) as record_count
FROM cows c
LEFT JOIN milking_records m ON c.id = m.cowId
WHERE c.status = 'active'
GROUP BY c.id, c.tagNumber, c.name
ORDER BY total_milk DESC;
```

### Get pregnant cows with expected calving dates
```sql
SELECT c.tagNumber, c.name, p.expectedCalvingDate
FROM cows c
JOIN pregnancy_records p ON c.id = p.cowId
WHERE p.status = 'confirmed'
  AND p.expectedCalvingDate >= CURRENT_DATE
ORDER BY p.expectedCalvingDate ASC;
```

### Get cows due for heat detection (21 days since last heat)
```sql
SELECT c.tagNumber, c.name, MAX(h.detectedDate) as last_heat
FROM cows c
LEFT JOIN heat_records h ON c.id = h.cowId
WHERE c.status = 'active' AND c.gender = 'Female'
GROUP BY c.id, c.tagNumber, c.name
HAVING MAX(h.detectedDate) IS NULL 
   OR MAX(h.detectedDate) < CURRENT_DATE - INTERVAL '21 days';
```

---

## Backup & Restore

### Backup
```bash
docker compose exec postgres pg_dump -U cattle_user cattle_db > backup.sql
```

### Restore
```bash
docker compose exec -T postgres psql -U cattle_user cattle_db < backup.sql
```
