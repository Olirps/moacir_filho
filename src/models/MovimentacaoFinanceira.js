const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const MovimentacaoFinanceira = sequelize.define('MovimentacaoFinanceira', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    parcela: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    descricao: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    financeiro_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'financeiro',
            key: 'id',
        },
        allowNull: false,
    },
    data_pagamento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    vencimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    valor_parcela: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    valor_pago: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    banco_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'banco',
            key: 'id',
        },
        allowNull: true,
    },
    metodo_pagamento: {
        type: DataTypes.ENUM('transferencia', 'boleto', 'credito', 'debito', 'dinheiro', 'PIX'),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'realizado', 'cancelado'),
        defaultValue: 'pendente',
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'MovimentacaoFinanceira',
    tableName: 'movimentacaofinanceira',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = MovimentacaoFinanceira;
