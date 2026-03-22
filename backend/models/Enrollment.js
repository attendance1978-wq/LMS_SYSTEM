const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  school_id: { type: DataTypes.INTEGER, allowNull: false },
  academic_year: { type: DataTypes.STRING(20), defaultValue: '2024-2025' },
  semester: { type: DataTypes.STRING(50), defaultValue: '1st Semester' },
  grade_level: { type: DataTypes.STRING(50), defaultValue: null },
  section: { type: DataTypes.STRING(50), defaultValue: null },
  enrollment_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('Pending', 'Enrolled', 'Dropped', 'Completed'),
    defaultValue: 'Pending',
  },
  remarks: { type: DataTypes.TEXT, defaultValue: null },
}, { tableName: 'enrollments' });

module.exports = Enrollment;
