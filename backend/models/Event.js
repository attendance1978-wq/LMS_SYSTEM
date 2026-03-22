const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  school_id: { type: DataTypes.INTEGER, defaultValue: null },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: null },
  event_date: { type: DataTypes.DATEONLY, allowNull: false },
  start_time: { type: DataTypes.TIME, defaultValue: null },
  end_time: { type: DataTypes.TIME, defaultValue: null },
  venue: { type: DataTypes.STRING(200), defaultValue: null },
  type: {
    type: DataTypes.ENUM('Academic', 'Sports', 'Cultural', 'Seminar', 'Holiday', 'Other'),
    defaultValue: 'Academic',
  },
  is_school_wide: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_by: { type: DataTypes.INTEGER, defaultValue: null },
}, { tableName: 'events' });

module.exports = Event;
