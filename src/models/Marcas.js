// src/models/Marca.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Marcas = sequelize.define('Marcas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'marcas',
  timestamps: true,
});

module.exports = Marcas;
