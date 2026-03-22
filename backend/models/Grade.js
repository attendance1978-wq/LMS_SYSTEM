const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Grade = sequelize.define('Grade', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  exam_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  remarks: { type: DataTypes.STRING(100), defaultValue: null },
  graded_by: { type: DataTypes.INTEGER, defaultValue: null }, // teacher_id
  graded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'grades' });

module.exports = Grade;
