const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.ENUM('superadmin', 'mainadmin', 'schooladmin', 'teacher', 'student'),
    allowNull: false,
    unique: true,
  },
  permissions: { type: DataTypes.JSON, defaultValue: {} },
  description: { type: DataTypes.STRING(255), defaultValue: null },
}, { tableName: 'roles' });

module.exports = Role;
