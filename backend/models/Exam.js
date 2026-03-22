const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  school_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  type: {
    type: DataTypes.ENUM('Quiz', 'Midterm', 'Finals', 'Activity', 'Assignment', 'Project'),
    defaultValue: 'Quiz',
  },
  exam_date: { type: DataTypes.DATEONLY, allowNull: false },
  total_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.00 },
  passing_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 75.00 },
  weight: { type: DataTypes.DECIMAL(5, 2), defaultValue: 1.00 },
  description: { type: DataTypes.TEXT, defaultValue: null },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'exams' });

module.exports = Exam;
