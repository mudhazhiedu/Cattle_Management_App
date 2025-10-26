module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('CalvingRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    pregnancy_id: DataTypes.INTEGER,
    calving_date: { type: DataTypes.DATEONLY, allowNull: false },
    calving_time: DataTypes.TIME,
    calving_ease_score: DataTypes.INTEGER,
    calf_gender: DataTypes.STRING(10),
    calf_birth_weight: DataTypes.DECIMAL(5,2),
    calf_health_status: DataTypes.STRING(50),
    calf_tag_id: DataTypes.STRING(50),
    retained_placenta: { type: DataTypes.BOOLEAN, defaultValue: false },
    complications: DataTypes.TEXT,
    notes: DataTypes.TEXT
  }, {
    tableName: 'calving_records'
  });
};
