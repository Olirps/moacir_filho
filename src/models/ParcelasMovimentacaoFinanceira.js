const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ParcelaMovimentacaoFinanceira = sequelize.define('ParcelaMovimentacaoFinanceira', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pagamento_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'movimentacaofinanceira',
            key: 'id',
        },
        allowNull: false,
    },
    numero_parcela: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    valor_parcela: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    data_vencimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'paga', 'atrasada'),
        defaultValue: 'pendente',
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'ParcelaMovimentacaoFinanceira',
    tableName: 'parcelamovimentacaofinanceira',
    timestamps: false // Desabilita os timestamps automáticos
});

module.exports = ParcelaMovimentacaoFinanceira;
