// src/models/Produtos.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Produtos = sequelize.define('Produtos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cProd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cEAN: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    xProd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    NCM: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    CFOP: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uCom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    qCom: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    vUnCom: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    vProd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    validade: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    qtdMinima: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'produtos',
    timestamps: true,
});

module.exports = Produtos;
