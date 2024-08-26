// src/models/TipoVeiculo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TipoVeiculo = sequelize.define('TipoVeiculo', {
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
  tableName: 'tipoveiculo',
  timestamps: true,
});

module.exports = TipoVeiculo;
