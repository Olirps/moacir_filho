// src/models/MovimentacoesEstoque.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Produtos = require('../models/Produtos');
const NotaFiscal = require('../models/NotaFiscal');


const MovimentacoesEstoque = sequelize.define('MovimentacoesEstoque', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Produtos', // Nome da tabela associada
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    nota_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'nota_fiscal', // Nome da tabela associada
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    tipo_movimentacao: {
        type: DataTypes.ENUM('entrada', 'saida'),
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    data_movimentacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    observacoes: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'MovimentacoesEstoque',
    tableName: 'movimentacoes_estoque',
    timestamps: false // Desabilita os timestamps automáticos
});

// Associação com Produtos
MovimentacoesEstoque.belongsTo(Produtos, {
    foreignKey: 'produto_id',
    as: 'produto'
});

module.exports = MovimentacoesEstoque;
