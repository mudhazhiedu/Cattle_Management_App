const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Cow = require('./cow')(sequelize);
const MilkingRecord = require('./milking')(sequelize);

Cow.hasMany(MilkingRecord, { foreignKey: 'cow_id', as: 'milking_records' });
MilkingRecord.belongsTo(Cow, { foreignKey: 'cow_id', as: 'cow' });

module.exports = {
  sequelize,
  Cow,
  MilkingRecord
};
