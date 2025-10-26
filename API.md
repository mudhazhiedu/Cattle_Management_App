# API Documentation

Base URL: `http://98.90.190.211/api` (Production) or `http://localhost:5000/api` (Development)

## Authentication

### POST /auth/login
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "fullName": "Farm Administrator"
  }
}
```

### POST /auth/register (Admin only)
Create new user account.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "username": "worker1",
  "password": "password123",
  "fullName": "John Worker",
  "role": "user"
}
```

**Response:**
```json
{
  "id": 2,
  "username": "worker1",
  "role": "user",
  "fullName": "John Worker"
}
```

## Cows

### GET /cows
Get all cows with optional filters.

**Query Parameters:**
- `status` - Filter by status (active/sold/deceased)

**Response:**
```json
[
  {
    "id": 1,
    "tagNumber": "COW001",
    "name": "Bessie",
    "breed": "Holstein",
    "dateOfBirth": "2020-05-15",
    "gender": "Female",
    "status": "active",
    "purchaseDate": "2020-06-01",
    "purchasePrice": 1500.00,
    "currentValue": 2000.00
  }
]
```

### GET /cows/:id
Get single cow with related records.

**Response:**
```json
{
  "id": 1,
  "tagNumber": "COW001",
  "name": "Bessie",
  "breed": "Holstein",
  "dateOfBirth": "2020-05-15",
  "gender": "Female",
  "status": "active",
  "milkingRecords": [...],
  "heatRecords": [...],
  "aiRecords": [...],
  "pregnancyRecords": [...],
  "calvingRecords": [...]
}
```

### POST /cows
Create new cow. (Admin only)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "tagNumber": "COW002",
  "name": "Daisy",
  "breed": "Jersey",
  "dateOfBirth": "2021-03-20",
  "gender": "Female",
  "status": "active",
  "purchaseDate": "2021-04-01",
  "purchasePrice": 1200.00
}
```

### PUT /cows/:id
Update cow. (Admin only)

**Headers:** `Authorization: Bearer <token>`

### DELETE /cows/:id
Delete cow. (Admin only)

**Headers:** `Authorization: Bearer <token>`

## Milking Records

### GET /milking
Get all milking records.

**Query Parameters:**
- `cowId` - Filter by cow ID
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": 1,
    "cowId": 1,
    "date": "2024-01-15",
    "morningYield": 12.5,
    "eveningYield": 11.8,
    "totalYield": 24.3,
    "notes": "Good quality milk",
    "Cow": {
      "tagNumber": "COW001",
      "name": "Bessie"
    }
  }
]
```

### POST /milking
Record milking data.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cowId": 1,
  "date": "2024-01-15",
  "morningYield": 12.5,
  "eveningYield": 11.8,
  "notes": "Good quality milk"
}
```

### GET /milking/stats
Get milking statistics.

**Query Parameters:**
- `startDate`, `endDate` - Date range

**Response:**
```json
{
  "totalYield": 1250.5,
  "averageYield": 25.3,
  "recordCount": 50
}
```

## Breeding

### POST /breeding/heat
Record heat detection.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cowId": 1,
  "detectedDate": "2024-01-10",
  "intensity": "strong",
  "notes": "Clear signs observed"
}
```

### GET /breeding/heat
Get heat records.

**Query Parameters:**
- `cowId` - Filter by cow

### POST /breeding/ai
Record artificial insemination.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cowId": 1,
  "aiDate": "2024-01-11",
  "bullId": "BULL123",
  "technician": "Dr. Smith",
  "notes": "Successful procedure"
}
```

### GET /breeding/ai
Get AI records.

### POST /breeding/pregnancy
Record pregnancy check.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cowId": 1,
  "checkDate": "2024-02-15",
  "status": "confirmed",
  "expectedCalvingDate": "2024-10-15",
  "notes": "Healthy pregnancy"
}
```

### GET /breeding/pregnancy
Get pregnancy records.

### POST /breeding/calving
Record calving event.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cowId": 1,
  "calvingDate": "2024-10-15",
  "calfGender": "Female",
  "calfTagNumber": "CALF001",
  "difficulty": "normal",
  "notes": "Healthy calf"
}
```

### GET /breeding/calving
Get calving records.

## Error Responses

**401 Unauthorized:**
```json
{
  "error": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "error": "Cow not found"
}
```

**500 Server Error:**
```json
{
  "error": "Internal server error"
}
```
