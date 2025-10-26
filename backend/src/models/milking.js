module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('MilkingRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    record_date: { type: DataTypes.DATEONLY, allowNull: false },
    record_time: { type: DataTypes.TIME, allowNull: false },
    session: { type: DataTypes.STRING(10), defaultValue: 'AM' },
    yield_liters: { type: DataTypes.DECIMAL(7,2), allowNull: false },
    fat_percentage: DataTypes.DECIMAL(5,2),
    protein_percentage: DataTypes.DECIMAL(5,2),
    scc: DataTypes.INTEGER,
    lactose_percentage: DataTypes.DECIMAL(5,2),
    temperature: DataTypes.DECIMAL(4,2),
    milker_name: DataTypes.STRING(100),
    lactation_number: DataTypes.INTEGER,
    days_in_milk: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    tableName: 'milking_records'
  });
};
