const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100), allowNull: false },
  middle_name: { type: DataTypes.STRING(100), defaultValue: null },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: {
    type: DataTypes.ENUM('superadmin', 'mainadmin', 'schooladmin', 'teacher', 'student'),
    allowNull: false,
  },
  school_id: { type: DataTypes.INTEGER, defaultValue: null },
  location_id: { type: DataTypes.INTEGER, defaultValue: null },
  student_id_number: { type: DataTypes.STRING(50), defaultValue: null, unique: true },
  phone: { type: DataTypes.STRING(20), defaultValue: null },
  address: { type: DataTypes.TEXT, defaultValue: null },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), defaultValue: null },
  birth_date: { type: DataTypes.DATEONLY, defaultValue: null },
  profile_photo: { type: DataTypes.STRING(255), defaultValue: null },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login: { type: DataTypes.DATE, defaultValue: null },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
  },
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.fullName = function () {
  return `${this.first_name} ${this.middle_name ? this.middle_name + ' ' : ''}${this.last_name}`;
};

module.exports = User;
