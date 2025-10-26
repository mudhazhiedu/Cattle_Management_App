# User Guide

Complete guide for using the Cattle Management App.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Cow Management](#cow-management)
4. [Milking Records](#milking-records)
5. [Breeding Management](#breeding-management)
6. [User Roles](#user-roles)

---

## Getting Started

### Accessing the App

**Production:** http://98.90.190.211  
**Development:** http://localhost:3000

### Login

1. Navigate to the login page
2. Enter your username and password
3. Click "Login"

**Default Admin Account:**
- Username: `admin`
- Password: `admin123`

**Note:** Change the default password after first login.

---

## Dashboard

The dashboard provides a quick overview of your farm operations.

### Key Metrics

- **Total Active Cows**: Number of cows with "active" status
- **Average Daily Milk**: Average milk production per cow per day
- **Total Milk This Month**: Cumulative milk production for current month

### Recent Milking Records

View the 10 most recent milking entries with:
- Cow tag number and name
- Date of milking
- Morning, evening, and total yield
- Quick access to cow details

---

## Cow Management

### Viewing Cows

1. Click "Cows" in the navigation bar
2. View all cows in a sortable table
3. Click any row to view cow details

**Table Columns:**
- Tag Number
- Name
- Breed
- Date of Birth
- Gender
- Status

### Adding a New Cow (Admin Only)

1. Go to Cows page
2. Click "Add New Cow" button
3. Fill in the form:
   - **Tag Number** (required, unique): Ear tag ID
   - **Name**: Cow's name
   - **Breed**: Holstein, Jersey, Angus, etc.
   - **Date of Birth**: Birth date
   - **Gender**: Male or Female
   - **Status**: Active, Sold, or Deceased
   - **Purchase Date**: Date acquired
   - **Purchase Price**: Amount paid
   - **Current Value**: Estimated current value
   - **Notes**: Additional information
4. Click "Add Cow"

### Editing a Cow (Admin Only)

1. Click on a cow to view details
2. Click "Edit" button
3. Update fields as needed
4. Click "Save Changes"

### Deleting a Cow (Admin Only)

1. View cow details
2. Click "Delete" button
3. Confirm deletion

**Warning:** Deleting a cow removes all associated records (milking, breeding, etc.)

---

## Milking Records

### Recording Daily Milk Production

1. From Dashboard or Cow Details page
2. Click "Record Milking" or use the milking form
3. Fill in:
   - **Cow**: Select from dropdown
   - **Date**: Milking date
   - **Morning Yield**: Liters from morning milking
   - **Evening Yield**: Liters from evening milking
   - **Notes**: Quality observations, health notes
4. Click "Record Milking"

**Note:** Total yield is calculated automatically.

### Viewing Milking History

**From Dashboard:**
- View recent records for all cows

**From Cow Details:**
- View complete milking history for that cow
- Sort by date, yield, etc.

### Best Practices

- Record milking data daily for accurate tracking
- Note any quality issues (color, consistency)
- Record health observations (appetite, behavior)
- Track morning and evening separately for pattern analysis

---

## Breeding Management

Access breeding features by clicking "Breeding" in the navigation bar.

### Heat Detection

**Purpose:** Track when cows are in heat for optimal breeding timing.

**Recording Heat:**
1. Go to Breeding → Heat Detection tab
2. Click "Record Heat Detection"
3. Fill in:
   - **Cow**: Select cow
   - **Detected Date**: When heat was observed
   - **Intensity**: Weak, Moderate, or Strong
   - **Notes**: Behavioral signs (mounting, restlessness, etc.)
4. Click "Record Heat"

**Heat Cycle:** Cows typically cycle every 21 days. Use this to predict next heat.

### Artificial Insemination (AI)

**Purpose:** Record AI procedures for breeding.

**Recording AI:**
1. Go to Breeding → AI Records tab
2. Click "Record AI"
3. Fill in:
   - **Cow**: Select cow
   - **AI Date**: Procedure date
   - **Bull ID**: Semen straw identification
   - **Technician**: Who performed the AI
   - **Notes**: Procedure details
4. Click "Record AI"

**Timing:** AI should be performed 12-18 hours after heat detection.

### Pregnancy Tracking

**Purpose:** Track pregnancy checks and expected calving dates.

**Recording Pregnancy Check:**
1. Go to Breeding → Pregnancy tab
2. Click "Record Pregnancy Check"
3. Fill in:
   - **Cow**: Select cow
   - **Check Date**: Examination date
   - **Status**: Confirmed, Not Pregnant, or Uncertain
   - **Expected Calving Date**: If confirmed (280 days from AI)
   - **Notes**: Veterinary observations
4. Click "Record Check"

**Timing:** First check at 30-45 days after AI, confirm at 60-90 days.

### Calving Records

**Purpose:** Document birth events and calf information.

**Recording Calving:**
1. Go to Breeding → Calving tab
2. Click "Record Calving"
3. Fill in:
   - **Cow**: Mother cow
   - **Calving Date**: Birth date
   - **Calf Gender**: Male or Female
   - **Calf Tag Number**: New calf's ear tag
   - **Difficulty**: Easy, Normal, Difficult, or Assisted
   - **Notes**: Birth details, calf health
4. Click "Record Calving"

**Next Steps:** Add the calf as a new cow in Cow Management.

---

## User Roles

### Admin Role

**Full Access:**
- Add, edit, delete cows
- Record milking and breeding data
- View all reports and statistics
- Create new user accounts
- Delete any records

**Responsibilities:**
- Manage farm inventory
- Oversee data accuracy
- Train farm workers
- Review reports regularly

### User Role (Farm Workers)

**Limited Access:**
- View cow list and details
- Record milking data
- Record breeding events (heat, AI, pregnancy, calving)
- View reports and statistics

**Cannot:**
- Add or delete cows
- Delete milking or breeding records
- Create user accounts
- Access admin settings

**Responsibilities:**
- Record daily milking accurately
- Observe and report heat detection
- Document breeding events
- Note any health concerns

---

## Tips & Best Practices

### Data Entry
- Record data daily for accuracy
- Use consistent naming conventions
- Double-check tag numbers before saving
- Add detailed notes for future reference

### Breeding Management
- Track heat cycles to predict next heat
- Perform AI within optimal window (12-18 hours after heat)
- Schedule pregnancy checks at 30-45 days
- Monitor expected calving dates closely

### Milk Production
- Record morning and evening separately
- Note any sudden drops in production (may indicate health issues)
- Track trends over time for each cow
- Compare against breed averages

### Health Monitoring
- Use notes fields to document observations
- Report unusual behavior immediately
- Track patterns in milking and breeding data
- Maintain regular veterinary check schedules

---

## Troubleshooting

### Cannot Login
- Verify username and password
- Check with farm administrator
- Ensure internet connection is stable

### Data Not Saving
- Check all required fields are filled
- Verify date formats are correct
- Ensure tag numbers are unique
- Contact administrator if issue persists

### Missing Records
- Check date filters on tables
- Verify cow status (active vs. sold/deceased)
- Use search functionality
- Contact administrator for data recovery

---

## Support

For technical issues or questions:
- Contact farm administrator
- Check API.md for technical documentation
- Review DATABASE.md for data structure
- See CHANGELOG.md for recent updates
