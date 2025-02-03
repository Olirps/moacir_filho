const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Financeiro = sequelize.define('Financeiro', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fornecedor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'fornecedores',
            key: 'id',
        },
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'clientes',
            key: 'id',
        },
    },
    funcionario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'funcionarios',
            key: 'id',
        },
    },
    nota_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'nota_fiscal',
            key: 'id',
        },
    },
    data_lancamento: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    tipo: {
        type: DataTypes.ENUM('credito', 'debito'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('aberta', 'andamento','quitada','cancelada'),
        allowNull: true 
    }
}, {
    sequelize,
    modelName: 'Financeiro',
    tableName: 'financeiro',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = Financeiro;
