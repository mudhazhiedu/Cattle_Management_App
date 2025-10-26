module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('FinancialTransaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_date: { type: DataTypes.DATEONLY, allowNull: false },
    transaction_type: { 
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false 
    },
    category: { 
      type: DataTypes.STRING(100),
      allowNull: false
    },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    quantity: DataTypes.DECIMAL(10,2),
    price_per_unit: DataTypes.DECIMAL(10,2),
    description: DataTypes.TEXT,
    payment_method: DataTypes.STRING(50),
    payment_status: { 
      type: DataTypes.ENUM('paid', 'pending', 'overdue'),
      defaultValue: 'paid'
    },
    related_cow_id: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    tableName: 'financial_transactions',
    timestamps: true
  });
};
