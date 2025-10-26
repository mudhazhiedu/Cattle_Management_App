module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('AIRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    ai_date: { type: DataTypes.DATEONLY, allowNull: false },
    ai_time: DataTypes.TIME,
    technician_name: DataTypes.STRING(100),
    bull_id: DataTypes.STRING(50),
    bull_breed: DataTypes.STRING(50),
    semen_batch: DataTypes.STRING(50),
    semen_cost: DataTypes.DECIMAL(8,2),
    insemination_method: DataTypes.STRING(50),
    attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 },
    notes: DataTypes.TEXT
  }, {
    tableName: 'ai_records'
  });
};
