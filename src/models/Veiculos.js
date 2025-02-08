// src/models/Veiculos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Veiculos = sequelize.define('Veiculos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  placa: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  ano: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  anomodelo: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  quilometragem: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  marcaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'marcas',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  tipoveiculoId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tipoveiculo',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'veiculos',
  timestamps: true,
});

module.exports = Veiculos;
