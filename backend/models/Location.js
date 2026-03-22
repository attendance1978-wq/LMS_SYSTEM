const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Location = sequelize.define('Location', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  province: { type: DataTypes.STRING(100), defaultValue: 'Surigao del Norte' },
  region: { type: DataTypes.STRING(100), defaultValue: 'Region XIII (Caraga)' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'locations' });

module.exports = Location;
