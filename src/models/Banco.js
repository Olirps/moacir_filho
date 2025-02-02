const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Banco = sequelize.define('Banco', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    agencia: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    conta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo_conta: {
        type: DataTypes.ENUM('corrente', 'poupanca'),
        allowNull: false,
    },
    documento: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Banco',
    tableName: 'banco',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = Banco;
