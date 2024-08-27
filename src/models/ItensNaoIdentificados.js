// src/models/ItensNaoIdentificados.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ItensNaoIdentificados = sequelize.define('ItensNaoIdentificados', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        allowNull: true,
    },
    cProdANP: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    DataImportacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Não identificado',
    },
    ProdutoRelacionadoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Produtos', // Referencia à tabela de Produtos
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }
}, {
    tableName: 'itens_nao_identificados',
    timestamps: true, // Se desejar adicionar createdAt e updatedAt
});

module.exports = ItensNaoIdentificados;
