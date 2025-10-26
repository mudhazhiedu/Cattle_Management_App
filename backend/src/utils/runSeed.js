require('dotenv').config();
const { sequelize } = require('../models');
const seedFarmData = require('./seedFarmData');

async function run() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected');

    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✓ Schema synced');

    console.log('\n⚠️  WARNING: This will add sample data to your database');
    console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    await seedFarmData();

    console.log('\n✅ All done! You can now login and explore the data:');
    console.log('   Admin: admin / admin123');
    console.log('   Worker: worker1 / worker123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

run();
