module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('FeedInventory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    feed_type: { 
      type: DataTypes.ENUM('hay', 'silage', 'concentrates', 'minerals', 'supplements'),
      allowNull: false 
    },
    feed_name: { type: DataTypes.STRING(200), allowNull: false },
    current_stock_kg: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    cost_per_kg: DataTypes.DECIMAL(8,2),
    purchase_date: DataTypes.DATEONLY,
    supplier_name: DataTypes.STRING(200),
    low_stock_threshold: { type: DataTypes.DECIMAL(10,2), defaultValue: 100 },
    notes: DataTypes.TEXT
  }, {
    tableName: 'feed_inventory',
    timestamps: true
  });
};
