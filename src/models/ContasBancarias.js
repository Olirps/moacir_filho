const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ContasBancarias = sequelize.define('ContasBancarias', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    banco_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'banco',
            key: 'id',
        },
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    agencia: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    conta: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo_conta: {
        type: DataTypes.ENUM('corrente', 'poupanca'),
        allowNull: false,
    },
    documento: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'ContasBancarias',
    tableName: 'contasbancarias',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = ContasBancarias;
