const bcrypt = require('bcryptjs');
const { User, Cow, MilkingRecord, HeatRecord, AIRecord, PregnancyRecord, CalvingRecord, HealthRecord, FinancialTransaction, Reminder, FeedInventory, FeedConsumption } = require('../models');

// Helper to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to add days to date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const seedFarmData = async () => {
  try {
    console.log('🌱 Starting farm data seeding...');

    // 1. Create Users
    console.log('Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const workerPassword = await bcrypt.hash('worker123', 10);
    
    await User.bulkCreate([
      { username: 'admin', password: adminPassword, fullName: 'Farm Owner', role: 'admin' },
      { username: 'worker1', password: workerPassword, fullName: 'John Worker', role: 'user' },
      { username: 'worker2', password: workerPassword, fullName: 'Mary Worker', role: 'user' }
    ], { ignoreDuplicates: true });

    // 2. Create 25 Cows (realistic mix)
    console.log('Creating 25 cows...');
    const breeds = ['Holstein', 'Jersey', 'Guernsey', 'Brown Swiss'];
    const statuses = ['Milking', 'Pregnant', 'Dry', 'Heifer'];
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const cows = [];
    for (let i = 1; i <= 25; i++) {
      const birthDate = randomDate(new Date('2018-01-01'), new Date('2022-01-01'));
      const purchaseDate = randomDate(twoYearsAgo, new Date());
      cows.push({
        tag_id: `COW${String(i).padStart(3, '0')}`,
        name: `Bessie ${i}`,
        breed: breeds[Math.floor(Math.random() * breeds.length)],
        birth_date: birthDate,
        gender: 'Female',
        current_status: statuses[Math.floor(Math.random() * statuses.length)],
        purchase_date: purchaseDate,
        purchase_price: 1200 + Math.random() * 800,
        current_weight: 450 + Math.random() * 150,
        body_condition_score: 2.5 + Math.random() * 1.5,
        notes: `Purchased from local farm`
      });
    }
    const createdCows = await Cow.bulkCreate(cows);
    console.log(`✓ Created ${createdCows.length} cows`);

    // 3. Create Feed Inventory
    console.log('Creating feed inventory...');
    const feeds = await FeedInventory.bulkCreate([
      { feed_type: 'hay', feed_name: 'Premium Alfalfa Hay', current_stock_kg: 5000, cost_per_kg: 0.50, supplier_name: 'Green Valley Farms', low_stock_threshold: 500 },
      { feed_type: 'silage', feed_name: 'Corn Silage', current_stock_kg: 8000, cost_per_kg: 0.30, supplier_name: 'Midwest Feed Co', low_stock_threshold: 1000 },
      { feed_type: 'concentrates', feed_name: 'Dairy Concentrate Mix', current_stock_kg: 2000, cost_per_kg: 1.20, supplier_name: 'NutriCow Inc', low_stock_threshold: 300 },
      { feed_type: 'minerals', feed_name: 'Mineral Supplement', current_stock_kg: 500, cost_per_kg: 2.50, supplier_name: 'VitaFarm', low_stock_threshold: 50 },
      { feed_type: 'supplements', feed_name: 'Protein Supplement', current_stock_kg: 300, cost_per_kg: 3.00, supplier_name: 'ProFeed Ltd', low_stock_threshold: 50 }
    ]);
    console.log(`✓ Created ${feeds.length} feed items`);

    // 4. Generate 2 years of data for each cow
    console.log('Generating 2 years of historical data...');
    
    const startDate = twoYearsAgo;
    const endDate = new Date();
    let milkingCount = 0;
    let healthCount = 0;
    let breedingCount = 0;
    let feedCount = 0;
    let financialCount = 0;

    for (const cow of createdCows) {
      // Skip if cow is too young (less than 2 years old)
      const cowAge = (new Date() - new Date(cow.birth_date)) / (1000 * 60 * 60 * 24 * 365);
      if (cowAge < 2) continue;

      // MILKING RECORDS (daily for milking cows, last 6 months)
      if (cow.current_status === 'Milking') {
        const milkingStart = addDays(endDate, -180); // Last 6 months
        for (let d = new Date(milkingStart); d <= endDate; d.setDate(d.getDate() + 1)) {
          const morningYield = 10 + Math.random() * 8;
          const eveningYield = 9 + Math.random() * 7;
          await MilkingRecord.create({
            cow_id: cow.id,
            record_date: new Date(d),
            record_time: '06:00',
            session: 'AM',
            yield_liters: morningYield,
            fat_percentage: 3.5 + Math.random() * 0.8,
            protein_percentage: 3.0 + Math.random() * 0.5,
            scc: 150000 + Math.random() * 100000,
            lactation_number: Math.floor(cowAge - 1),
            days_in_milk: Math.floor((endDate - milkingStart) / (1000 * 60 * 60 * 24)),
            milker_name: Math.random() > 0.5 ? 'John Worker' : 'Mary Worker'
          });
          milkingCount++;
        }
      }

      // BREEDING CYCLE (2-3 cycles over 2 years)
      const cycles = Math.floor(1 + Math.random() * 2);
      let cycleDate = new Date(startDate);
      
      for (let cycle = 0; cycle < cycles; cycle++) {
        // Heat detection
        const heatDate = addDays(cycleDate, Math.floor(Math.random() * 30));
        if (heatDate <= endDate) {
          await HeatRecord.create({
            cow_id: cow.id,
            observation_date: heatDate,
            intensity: ['weak', 'moderate', 'strong'][Math.floor(Math.random() * 3)],
            notes: 'Standing heat observed, mounting behavior'
          });
          breedingCount++;

          // AI (1-2 days after heat)
          const aiDate = addDays(heatDate, 1);
          const aiRecord = await AIRecord.create({
            cow_id: cow.id,
            ai_date: aiDate,
            bull_id: `BULL${Math.floor(Math.random() * 5) + 1}`,
            technician_name: 'Dr. Smith',
            notes: 'AI performed successfully'
          });
          breedingCount++;

          // Pregnancy check (30 days after AI)
          const pregCheckDate = addDays(aiDate, 30);
          if (pregCheckDate <= endDate) {
            const isPregnant = Math.random() > 0.3; // 70% success rate
            const expectedCalving = isPregnant ? addDays(aiDate, 283) : null;
            
            await PregnancyRecord.create({
              cow_id: cow.id,
              ai_record_id: aiRecord.id,
              check_date: pregCheckDate,
              check_method: 'Ultrasound',
              pregnancy_status: isPregnant ? 'confirmed' : 'not_pregnant',
              expected_calving_date: expectedCalving,
              notes: isPregnant ? 'Healthy pregnancy confirmed' : 'Not pregnant, will retry'
            });
            breedingCount++;

            // Calving (if pregnant and date has passed)
            if (isPregnant && expectedCalving <= endDate) {
              await CalvingRecord.create({
                cow_id: cow.id,
                calving_date: expectedCalving,
                calving_ease_score: Math.floor(1 + Math.random() * 3),
                calf_gender: Math.random() > 0.5 ? 'Female' : 'Male',
                calf_birth_weight: 35 + Math.random() * 10,
                calf_health_status: 'Healthy',
                calf_tag_id: `CALF${Date.now()}`,
                difficulty: ['easy', 'normal', 'difficult'][Math.floor(Math.random() * 3)],
                notes: 'Successful calving'
              });
              breedingCount++;
              cycleDate = addDays(expectedCalving, 60); // Next cycle after calving
            }
          }
        }
      }

      // HEALTH RECORDS (vaccinations, treatments)
      // Vaccinations (2-3 per year)
      const vaccinationDates = [
        addDays(startDate, 90),
        addDays(startDate, 270),
        addDays(startDate, 450),
        addDays(startDate, 630)
      ];
      
      for (const vDate of vaccinationDates) {
        if (vDate <= endDate) {
          await HealthRecord.create({
            cow_id: cow.id,
            record_type: 'vaccination',
            record_date: vDate,
            disease_name: ['FMD Vaccine', 'Brucellosis Vaccine', 'Anthrax Vaccine'][Math.floor(Math.random() * 3)],
            veterinarian_name: 'Dr. Johnson',
            cost: 25 + Math.random() * 25,
            next_due_date: addDays(vDate, 180),
            notes: 'Annual vaccination'
          });
          healthCount++;
        }
      }

      // Random treatments (1-3 over 2 years)
      const treatments = Math.floor(1 + Math.random() * 2);
      for (let t = 0; t < treatments; t++) {
        const treatDate = randomDate(startDate, endDate);
        await HealthRecord.create({
          cow_id: cow.id,
          record_type: 'treatment',
          record_date: treatDate,
          disease_name: ['Mastitis', 'Lameness', 'Digestive Issue'][Math.floor(Math.random() * 3)],
          symptoms: 'Reduced appetite, fever',
          veterinarian_name: 'Dr. Johnson',
          medication_name: 'Antibiotic',
          dosage: '10ml',
          route: 'injection',
          cost: 50 + Math.random() * 100,
          outcome: 'recovered',
          notes: 'Full recovery after treatment'
        });
        healthCount++;
      }

      // FEED CONSUMPTION (sample last 30 days)
      const feedStart = addDays(endDate, -30);
      for (let d = new Date(feedStart); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Daily hay consumption
        await FeedConsumption.create({
          cow_id: cow.id,
          feed_inventory_id: feeds[0].id, // Hay
          consumption_date: new Date(d),
          quantity_kg: 8 + Math.random() * 4,
          cost: (8 + Math.random() * 4) * 0.50
        });
        
        // Concentrate every other day
        if (d.getDate() % 2 === 0) {
          await FeedConsumption.create({
            cow_id: cow.id,
            feed_inventory_id: feeds[2].id, // Concentrate
            consumption_date: new Date(d),
            quantity_kg: 2 + Math.random() * 2,
            cost: (2 + Math.random() * 2) * 1.20
          });
        }
        feedCount += 2;
      }
    }

    // 5. FINANCIAL TRANSACTIONS
    console.log('Creating financial transactions...');
    
    // Milk sales (monthly for 2 years)
    for (let m = 0; m < 24; m++) {
      const saleDate = addDays(startDate, m * 30);
      if (saleDate <= endDate) {
        await FinancialTransaction.create({
          transaction_date: saleDate,
          transaction_type: 'income',
          category: 'Milk Sale',
          amount: 8000 + Math.random() * 4000,
          quantity: 15000 + Math.random() * 5000,
          price_per_unit: 0.55,
          description: 'Monthly milk sale to dairy',
          payment_method: 'bank_transfer',
          payment_status: 'paid'
        });
        financialCount++;
      }
    }

    // Feed purchases (quarterly)
    for (let q = 0; q < 8; q++) {
      const purchaseDate = addDays(startDate, q * 90);
      if (purchaseDate <= endDate) {
        await FinancialTransaction.create({
          transaction_date: purchaseDate,
          transaction_type: 'expense',
          category: 'Feed',
          amount: 3000 + Math.random() * 2000,
          description: 'Quarterly feed purchase',
          payment_method: 'bank_transfer',
          payment_status: 'paid'
        });
        financialCount++;
      }
    }

    // Labor costs (monthly)
    for (let m = 0; m < 24; m++) {
      const payDate = addDays(startDate, m * 30);
      if (payDate <= endDate) {
        await FinancialTransaction.create({
          transaction_date: payDate,
          transaction_type: 'expense',
          category: 'Labor',
          amount: 2000 + Math.random() * 500,
          description: 'Monthly worker salaries',
          payment_method: 'cash',
          payment_status: 'paid'
        });
        financialCount++;
      }
    }

    // Utilities (monthly)
    for (let m = 0; m < 24; m++) {
      const utilDate = addDays(startDate, m * 30);
      if (utilDate <= endDate) {
        await FinancialTransaction.create({
          transaction_date: utilDate,
          transaction_type: 'expense',
          category: 'Utilities',
          amount: 300 + Math.random() * 200,
          description: 'Electricity and water',
          payment_method: 'bank_transfer',
          payment_status: 'paid'
        });
        financialCount++;
      }
    }

    // 6. REMINDERS (upcoming tasks)
    console.log('Creating reminders...');
    let reminderCount = 0;
    
    for (const cow of createdCows.slice(0, 10)) { // First 10 cows
      // Upcoming vaccination
      await Reminder.create({
        cow_id: cow.id,
        reminder_type: 'vaccination',
        reminder_date: addDays(new Date(), Math.floor(Math.random() * 30)),
        message: 'Annual vaccination due',
        priority: 'medium',
        status: 'pending'
      });
      
      // Pregnancy check
      if (Math.random() > 0.5) {
        await Reminder.create({
          cow_id: cow.id,
          reminder_type: 'pregnancy_check',
          reminder_date: addDays(new Date(), Math.floor(Math.random() * 15)),
          message: 'Pregnancy check due (30 days post-AI)',
          priority: 'high',
          status: 'pending'
        });
      }
      reminderCount += 2;
    }

    console.log('\n✅ SEED DATA SUMMARY:');
    console.log(`   👥 Users: 3 (1 admin, 2 workers)`);
    console.log(`   🐄 Cows: ${createdCows.length}`);
    console.log(`   🥛 Milking Records: ${milkingCount}`);
    console.log(`   💕 Breeding Records: ${breedingCount}`);
    console.log(`   🏥 Health Records: ${healthCount}`);
    console.log(`   🌾 Feed Items: ${feeds.length}`);
    console.log(`   🍽️  Feed Consumption: ${feedCount}`);
    console.log(`   💰 Financial Transactions: ${financialCount}`);
    console.log(`   🔔 Reminders: ${reminderCount}`);
    console.log(`\n🎉 Farm data seeding completed successfully!`);
    console.log(`\n📊 This simulates a 25-cow farm with 2 years of operations`);
    console.log(`   Total records created: ${milkingCount + breedingCount + healthCount + feedCount + financialCount + reminderCount}`);

  } catch (error) {
    console.error('❌ Error seeding farm data:', error);
    throw error;
  }
};

module.exports = seedFarmData;
