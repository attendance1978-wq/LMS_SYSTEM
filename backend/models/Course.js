const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: null },
  school_id: { type: DataTypes.INTEGER, allowNull: false },
  teacher_id: { type: DataTypes.INTEGER, defaultValue: null },
  units: { type: DataTypes.INTEGER, defaultValue: 3 },
  schedule: { type: DataTypes.STRING(200), defaultValue: null },
  room: { type: DataTypes.STRING(100), defaultValue: null },
  semester: { type: DataTypes.STRING(50), defaultValue: '1st Semester' },
  academic_year: { type: DataTypes.STRING(20), defaultValue: '2024-2025' },
  max_students: { type: DataTypes.INTEGER, defaultValue: 40 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'courses' });

module.exports = Course;
