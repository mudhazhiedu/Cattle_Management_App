module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('FeedConsumption', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    feed_inventory_id: { type: DataTypes.INTEGER, allowNull: false },
    consumption_date: { type: DataTypes.DATEONLY, allowNull: false },
    quantity_kg: { type: DataTypes.DECIMAL(8,2), allowNull: false },
    cost: DataTypes.DECIMAL(10,2),
    notes: DataTypes.TEXT
  }, {
    tableName: 'feed_consumption',
    timestamps: true
  });
};
