module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Reminder', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cow_id: { type: DataTypes.INTEGER, allowNull: false },
    reminder_type: { 
      type: DataTypes.ENUM('heat', 'pregnancy_check', 'calving', 'vaccination', 'deworming', 'hoof_trim', 'dry_off', 'health_checkup'),
      allowNull: false 
    },
    reminder_date: { type: DataTypes.DATEONLY, allowNull: false },
    reminder_time: DataTypes.TIME,
    message: DataTypes.TEXT,
    priority: { 
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    status: { 
      type: DataTypes.ENUM('pending', 'completed', 'dismissed'),
      defaultValue: 'pending'
    },
    notification_sent: { type: DataTypes.BOOLEAN, defaultValue: false },
    completed_at: DataTypes.DATE
  }, {
    tableName: 'reminders',
    timestamps: true
  });
};
