const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Produtos = require('../models/Produtos');
const TipoVeiculo = require('../models/TipoVeiculo');


const ImpostoProduto = sequelize.define('ImpostoProduto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    produtoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Produtos,
            key: 'id',
        },
        allowNull: false,
    },
    vTotTrib: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    ICMS: {
        type: DataTypes.DECIMAL(10, 2), // Pode ser ajustado conforme a estrutura do ICMS
        allowNull: true,
    },
    IPI: {
        type: DataTypes.DECIMAL(10, 2), // Pode ser ajustado conforme a estrutura do IPI
        allowNull: true,
    },
    PIS: {
        type: DataTypes.DECIMAL(10, 2), // Pode ser ajustado conforme a estrutura do PIS
        allowNull: true,
    },
    COFINS: {
        type: DataTypes.DECIMAL(10, 2), // Pode ser ajustado conforme a estrutura do COFINS
        allowNull: true,
    }
}, {
    tableName: 'imposto_produtos',
    timestamps: false,
});

// Relacionamento entre Produto e ImpostoProduto
ImpostoProduto.belongsTo(Produtos, { foreignKey: 'produtoId' });

module.exports = ImpostoProduto;
