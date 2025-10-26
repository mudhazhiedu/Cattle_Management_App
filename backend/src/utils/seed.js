const { sequelize, Cow } = require('../models');

async function seed() {
  await sequelize.sync();
  const count = await Cow.count();
  if (count === 0) {
    await Cow.bulkCreate([
      { tag_id: 'C1001', name: 'Daisy', breed: 'Holstein', birth_date: '2019-04-01' },
      { tag_id: 'C1002', name: 'Molly', breed: 'Jersey', birth_date: '2020-06-12' }
    ]);
    console.log('Seeded cows');
  } else {
    console.log('Cows already present');
  }
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
