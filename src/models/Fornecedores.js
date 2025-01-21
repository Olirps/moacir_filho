// src/models/Fornecedores.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Fornecedores = sequelize.define('Fornecedores', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  nomeFantasia: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  fornecedor_contato: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  inscricaoestadual: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  cpfCnpj: {
    type: DataTypes.STRING(14),
    allowNull: true,
    unique: true,
  },
  fone: {
    type: DataTypes.STRING(11),
    allowNull: true
  },
  celular: {
    type: DataTypes.STRING(11),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  logradouro: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  numero: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  complemento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  municipio: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  uf: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  tipo_fornecedor: {
    type: DataTypes.ENUM('peça', 'maquinario', 'suplemento', 'transporte', 'servico'),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('S', 'N'),
    allowNull: true
  }
}, {
  tableName: 'fornecedores',
  timestamps: true,
});


module.exports = Fornecedores;
