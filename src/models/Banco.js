const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Banco = sequelize.define('Banco', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    codBancario: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: {
            name: 'codBancario' // Define um nome fixo para evitar múltiplas entradas
        },
        comment: 'Código bancário único para identificação do banco',
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Banco',
    tableName: 'banco',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = Banco;
