// src/models/Pessoas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Pessoas = sequelize.define('Pessoas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  
}, {
  tableName: 'pessoas',
  timestamps: true,
});


module.exports = Pessoas;
