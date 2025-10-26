module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('PregnancyRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    ai_record_id: DataTypes.INTEGER,
    check_date: { type: DataTypes.DATEONLY, allowNull: false },
    check_method: DataTypes.STRING(50),
    pregnancy_status: { type: DataTypes.STRING(20), defaultValue: 'Confirmed' },
    expected_calving_date: DataTypes.DATEONLY,
    dry_off_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT
  }, {
    tableName: 'pregnancy_records'
  });
};
