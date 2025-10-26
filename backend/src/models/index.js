const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize);
const Cow = require('./cow')(sequelize);
const MilkingRecord = require('./milking')(sequelize);
const HeatRecord = require('./heat')(sequelize);
const AIRecord = require('./ai')(sequelize);
const PregnancyRecord = require('./pregnancy')(sequelize);
const CalvingRecord = require('./calving')(sequelize);

// Associations
Cow.hasMany(MilkingRecord, { foreignKey: 'cow_id', as: 'milking_records' });
MilkingRecord.belongsTo(Cow, { foreignKey: 'cow_id', as: 'cow' });

Cow.hasMany(HeatRecord, { foreignKey: 'cow_id', as: 'heat_records' });
HeatRecord.belongsTo(Cow, { foreignKey: 'cow_id', as: 'cow' });

Cow.hasMany(AIRecord, { foreignKey: 'cow_id', as: 'ai_records' });
AIRecord.belongsTo(Cow, { foreignKey: 'cow_id', as: 'cow' });

Cow.hasMany(PregnancyRecord, { foreignKey: 'cow_id', as: 'pregnancy_records' });
PregnancyRecord.belongsTo(Cow, { foreignKey: 'cow_id', as: 'cow' });
PregnancyRecord.belongsTo(AIRecord, { foreignKey: 'ai_record_id', as: 'ai_record' });

Cow.hasMany(CalvingRecord, { foreignKey: 'cow_id', as: 'calving_records' });
CalvingRecord.belongsTo(Cow, { foreignKey: 'cow_id', as: 'cow' });
CalvingRecord.belongsTo(PregnancyRecord, { foreignKey: 'pregnancy_id', as: 'pregnancy' });

module.exports = {
  sequelize,
  User,
  Cow,
  MilkingRecord,
  HeatRecord,
  AIRecord,
  PregnancyRecord,
  CalvingRecord
};
