# Seed Data Documentation

## 🌱 Overview

This seed data script creates a realistic 25-cow dairy farm with 2 years of operational history. Perfect for testing, demos, and validation.

## 📊 What Gets Created

### Users (3)
- **admin** / admin123 (Farm Owner - Admin role)
- **worker1** / worker123 (John Worker - User role)
- **worker2** / worker123 (Mary Worker - User role)

### Cows (25)
- **Tag IDs:** COW001 to COW025
- **Breeds:** Holstein, Jersey, Guernsey, Brown Swiss (random mix)
- **Ages:** 2-6 years old (realistic distribution)
- **Statuses:** Milking, Pregnant, Dry, Heifer (realistic mix)
- **Purchase dates:** Spread over 2 years
- **Purchase prices:** $1,200 - $2,000 (realistic range)

### Milking Records (~4,500 records)
- **Frequency:** Daily for milking cows (last 6 months)
- **Sessions:** AM and PM
- **Yield:** 10-18 liters per session (realistic)
- **Quality metrics:** Fat %, Protein %, SCC
- **Lactation tracking:** Lactation number, Days in Milk
- **Workers:** Randomly assigned to John or Mary

### Breeding Records (~150 records)
- **Heat detections:** 2-3 cycles per cow over 2 years
- **AI records:** Following heat detection
- **Pregnancy checks:** 30 days post-AI
- **Success rate:** 70% (realistic)
- **Calving records:** For successful pregnancies
- **Bull IDs:** BULL1 to BULL5

### Health Records (~100 records)
- **Vaccinations:** 2-3 per year per cow
  - FMD Vaccine
  - Brucellosis Vaccine
  - Anthrax Vaccine
- **Treatments:** 1-3 per cow over 2 years
  - Mastitis
  - Lameness
  - Digestive issues
- **Costs:** $25-150 per event
- **Veterinarian:** Dr. Johnson

### Feed Inventory (5 items)
- **Premium Alfalfa Hay:** 5,000 kg @ $0.50/kg
- **Corn Silage:** 8,000 kg @ $0.30/kg
- **Dairy Concentrate Mix:** 2,000 kg @ $1.20/kg
- **Mineral Supplement:** 500 kg @ $2.50/kg
- **Protein Supplement:** 300 kg @ $3.00/kg

### Feed Consumption (~1,500 records)
- **Period:** Last 30 days
- **Daily hay:** 8-12 kg per cow
- **Concentrates:** 2-4 kg every other day
- **Auto-calculated costs**

### Financial Transactions (~100 records)
- **Milk Sales:** Monthly for 2 years
  - $8,000-12,000 per month
  - 15,000-20,000 liters
  - $0.55 per liter
- **Feed Purchases:** Quarterly
  - $3,000-5,000 per quarter
- **Labor Costs:** Monthly
  - $2,000-2,500 per month
- **Utilities:** Monthly
  - $300-500 per month

### Reminders (~20 pending)
- **Vaccinations due:** Next 30 days
- **Pregnancy checks:** Next 15 days
- **Priority levels:** High and Medium

## 🚀 How to Run

### Option 1: Docker (Recommended)

```bash
# From project root
docker compose exec backend npm run seed:farm
```

### Option 2: Local Development

```bash
# Navigate to backend
cd backend

# Run seed script
npm run seed:farm
```

### Option 3: Manual

```bash
# Navigate to backend
cd backend

# Run directly
node src/utils/runSeed.js
```

## ⚠️ Important Notes

### Before Running:
1. **Backup your data** if you have existing records
2. Script adds data, doesn't delete existing data
3. Takes 30-60 seconds to complete
4. Requires database connection

### After Running:
1. Login with: **admin** / **admin123**
2. Explore all modules to see data
3. Check dashboard for summary
4. View individual cow details

## 📈 Expected Results

### Total Records Created: ~6,500+
- Cows: 25
- Milking: ~4,500
- Breeding: ~150
- Health: ~100
- Feed Consumption: ~1,500
- Financial: ~100
- Reminders: ~20

### Database Size:
- Approximately 50-100 MB
- Depends on PostgreSQL configuration

### Performance:
- Seed time: 30-60 seconds
- Dashboard load: <2 seconds
- Cow detail load: <1 second

## 🔍 What to Test After Seeding

### 1. Dashboard
- ✅ Total cows count (should be 25+)
- ✅ Milking statistics
- ✅ Reminders widget (should show ~20)
- ✅ Recent milking records

### 2. Cows Page
- ✅ List of 25 cows
- ✅ Different breeds and statuses
- ✅ Click any cow to see detail

### 3. Cow Detail Page (Enhanced)
- ✅ Tab 1: Milking records (should have many)
- ✅ Tab 2: Breeding history (heat, AI, pregnancy, calving)
- ✅ Tab 3: Health records (vaccinations, treatments)
- ✅ Tab 4: Financial transactions (linked expenses)
- ✅ Tab 5: Feed consumption (last 30 days)
- ✅ Tab 6: Pending reminders

### 4. Breeding Page
- ✅ Heat records across all cows
- ✅ AI records with bull IDs
- ✅ Pregnancy records (some confirmed, some not)
- ✅ Calving records

### 5. Health Page
- ✅ Vaccinations tab (should have many)
- ✅ Treatments tab (mastitis, lameness, etc.)
- ✅ Cost totals

### 6. Financial Page
- ✅ Income tab: Monthly milk sales
- ✅ Expense tab: Feed, labor, utilities
- ✅ Summary cards: Income, Expense, Profit
- ✅ Should show positive profit

### 7. Feed Page
- ✅ Inventory tab: 5 feed items with stock
- ✅ Consumption tab: Last 30 days
- ✅ Stock levels should be reduced from consumption
- ✅ Total stock and value cards

### 8. Reminders
- ✅ Dashboard widget shows pending
- ✅ Different types (vaccination, pregnancy check)
- ✅ Priority levels (high, medium)

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution:** 
```bash
# Check if database is running
docker compose ps

# Restart database
docker compose restart postgres
```

### Issue: "Duplicate key error"
**Solution:** 
- Script tries to create admin user that already exists
- This is normal, script continues
- Other data will still be created

### Issue: "Seed takes too long"
**Solution:**
- Normal for 6,500+ records
- Wait 60 seconds
- Check logs for progress

### Issue: "Out of memory"
**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run seed:farm
```

## 🔄 Re-running Seed

### To Add More Data:
- Just run seed again
- Will add another 25 cows + data
- Useful for testing large farms

### To Start Fresh:
```bash
# WARNING: Deletes ALL data
docker compose down -v
docker compose up -d
npm run seed:farm
```

## 📊 Data Characteristics

### Realistic Patterns:
- ✅ Milking cows produce daily
- ✅ Breeding cycles follow 21-day heat pattern
- ✅ 70% AI success rate (realistic)
- ✅ Seasonal variations in milk production
- ✅ Random health issues (realistic frequency)
- ✅ Monthly financial patterns
- ✅ Daily feed consumption

### Data Quality:
- ✅ No orphaned records
- ✅ All foreign keys valid
- ✅ Dates in logical sequence
- ✅ Amounts in realistic ranges
- ✅ Complete interconnectivity

## 🎯 Use Cases

### 1. Development Testing
- Test all features with real data
- Verify interconnectivity
- Check performance with volume

### 2. Demo/Presentation
- Show potential users realistic farm
- Demonstrate all features
- Prove system capabilities

### 3. Training
- Train farm workers on real-looking data
- Practice data entry
- Learn navigation

### 4. Performance Testing
- Test with 6,500+ records
- Measure query performance
- Identify bottlenecks

### 5. Validation
- Verify calculations (totals, averages)
- Check auto-integration
- Confirm reminders work

## 💡 Customization

### To Change Number of Cows:
Edit `seedFarmData.js`:
```javascript
// Line 30
for (let i = 1; i <= 50; i++) { // Change 25 to 50
```

### To Change Time Period:
Edit `seedFarmData.js`:
```javascript
// Line 18
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 5); // Change 2 to 5
```

### To Add More Breeds:
Edit `seedFarmData.js`:
```javascript
// Line 32
const breeds = ['Holstein', 'Jersey', 'Guernsey', 'Brown Swiss', 'Ayrshire'];
```

## 📞 Support

If seed fails or data looks wrong:
1. Check database connection
2. Check logs for errors
3. Verify schema is synced
4. Try fresh database

## ✅ Success Checklist

After seeding, verify:
- [ ] Can login with admin/admin123
- [ ] Dashboard shows 25+ cows
- [ ] Cow detail page has data in all 6 tabs
- [ ] Financial shows profit
- [ ] Reminders widget has items
- [ ] Feed inventory shows stock
- [ ] All pages load without errors

---

**Seed data represents a realistic, profitable 25-cow dairy farm with 2 years of complete operational history.** 🐄📊
