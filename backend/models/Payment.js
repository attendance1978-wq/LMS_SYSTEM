const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  school_id: { type: DataTypes.INTEGER, allowNull: false },
  reference_no: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_date: { type: DataTypes.DATEONLY, allowNull: false },
  payment_type: {
    type: DataTypes.ENUM('Tuition', 'Miscellaneous', 'Books', 'Uniform', 'Laboratory', 'Other'),
    defaultValue: 'Tuition',
  },
  payment_method: {
    type: DataTypes.ENUM('Cash', 'Bank Transfer', 'GCash', 'Maya', 'Check'),
    defaultValue: 'Cash',
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Partial', 'Overdue', 'Cancelled'),
    defaultValue: 'Pending',
  },
  academic_year: { type: DataTypes.STRING(20), defaultValue: '2024-2025' },
  semester: { type: DataTypes.STRING(50), defaultValue: '1st Semester' },
  description: { type: DataTypes.TEXT, defaultValue: null },
  received_by: { type: DataTypes.INTEGER, defaultValue: null },
}, { tableName: 'payments' });

module.exports = Payment;
