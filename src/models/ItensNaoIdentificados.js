// src/models/ItensNaoIdentificados.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const NotaFiscal = require('../models/NotaFiscal');
const Produtos = require('../models/Produtos');


const ItensNaoIdentificados = sequelize.define('ItensNaoIdentificados', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    }
    ,
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'produtos', // Nome da tabela associada
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
    ,
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
        allowNull: true,
    },
    NCM: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    CFOP: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uCom: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    qCom: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    vUnCom: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    vProd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    validade: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    qtdMinima: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    EXTIPI: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    CEST: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    indEscala: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cEANTrib: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uTrib: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    qTrib: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    vUnTrib: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    vDesc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    indTot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cProdANP: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descANP: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    UFCons: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nBico: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nTanque: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    vEncIni: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    vEncFin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    pBio: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
}, {
    tableName: 'itens_nao_identificados',
    timestamps: true, // Se desejar adicionar createdAt e updatedAt
});

module.exports = ItensNaoIdentificados;
