module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('HealthRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    record_type: { 
      type: DataTypes.ENUM('vaccination', 'treatment', 'checkup', 'deworming', 'hoof_trim'),
      allowNull: false 
    },
    record_date: { type: DataTypes.DATEONLY, allowNull: false },
    disease_name: DataTypes.STRING(200),
    symptoms: DataTypes.TEXT,
    diagnosis: DataTypes.TEXT,
    veterinarian_name: DataTypes.STRING(100),
    treatment_plan: DataTypes.TEXT,
    medication_name: DataTypes.STRING(200),
    dosage: DataTypes.STRING(100),
    route: { 
      type: DataTypes.ENUM('oral', 'injection', 'topical', 'iv'),
      defaultValue: 'oral'
    },
    frequency: DataTypes.STRING(100),
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    withdrawal_period_days: DataTypes.INTEGER,
    cost: DataTypes.DECIMAL(10,2),
    next_due_date: DataTypes.DATEONLY,
    outcome: { 
      type: DataTypes.ENUM('recovered', 'ongoing', 'deceased'),
      defaultValue: 'ongoing'
    },
    notes: DataTypes.TEXT
  }, {
    tableName: 'health_records',
    timestamps: true
  });
};
