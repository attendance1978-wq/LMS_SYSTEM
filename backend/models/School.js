const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const School = sequelize.define('School', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  short_name: { type: DataTypes.STRING(50), defaultValue: null },
  location_id: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.TEXT, defaultValue: null },
  phone: { type: DataTypes.STRING(20), defaultValue: null },
  email: { type: DataTypes.STRING(150), defaultValue: null },
  principal_name: { type: DataTypes.STRING(200), defaultValue: null },
  school_type: {
    type: DataTypes.ENUM('Elementary', 'Junior High School', 'Senior High School', 'College', 'Vocational'),
    defaultValue: 'Senior High School',
  },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'schools' });

module.exports = School;
