const { DataTypes } = require('sequelize');
const sequelize = require('../mysequelize2');

const User = sequelize.define('User', {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  father_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING(255),  
    allowNull: false,
    unique: false, 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
