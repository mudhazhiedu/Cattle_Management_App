module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Cow', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tag_id: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    name: DataTypes.STRING(100),
    birth_date: DataTypes.DATEONLY,
    breed: DataTypes.STRING(50),
    purchase_date: DataTypes.DATEONLY,
    purchase_price: DataTypes.DECIMAL(10,2),
    current_status: { type: DataTypes.STRING(20), defaultValue: 'Heifer' },
    dam_id: DataTypes.INTEGER,
    sire_id: DataTypes.INTEGER,
    photo_url: DataTypes.TEXT,
    current_weight: DataTypes.DECIMAL(6,2),
    body_condition_score: DataTypes.DECIMAL(2,1),
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'cows'
  });
};
