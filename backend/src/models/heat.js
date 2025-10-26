module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('HeatRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    observation_date: { type: DataTypes.DATEONLY, allowNull: false },
    observation_time: DataTypes.TIME,
    heat_intensity: { type: DataTypes.STRING(20), defaultValue: 'Moderate' },
    symptoms: DataTypes.TEXT,
    next_expected_heat: DataTypes.DATEONLY,
    notes: DataTypes.TEXT
  }, {
    tableName: 'heat_records'
  });
};
