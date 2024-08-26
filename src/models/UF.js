// src/models/UF.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UF = sequelize.define('UF', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  codIBGE: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  sigla: {
    type: DataTypes.STRING(2),
    allowNull: false,
    unique: true,
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'uf',
  timestamps: true,
});

module.exports = UF;
