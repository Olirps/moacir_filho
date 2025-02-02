const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const MovimentacaoFinanceira = sequelize.define('MovimentacaoFinanceira', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        allowNull: false,
    },
    valor_pago: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    banco_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'banco',
            key: 'id',
        },
        allowNull: false,
    },
    metodo_pagamento: {
        type: DataTypes.ENUM('transferencia', 'boleto', 'cartao'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'realizado', 'cancelado'),
        defaultValue: 'pendente',
        allowNull: false,
    },
},{
    sequelize,
    modelName: 'MovimentacaoFinanceira',
    tableName: 'movimentacaofinanceira',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = MovimentacaoFinanceira;
