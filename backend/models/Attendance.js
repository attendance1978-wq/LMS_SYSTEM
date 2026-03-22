const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  teacher_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'),
    allowNull: false,
  },
  remarks: { type: DataTypes.STRING(255), defaultValue: null },
  time_in: { type: DataTypes.TIME, defaultValue: null },
}, { tableName: 'attendance' });

module.exports = Attendance;
