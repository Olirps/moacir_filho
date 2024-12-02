const { DataTypes } = require('sequelize');
const sequelize = require('../db');

  const VendasItens = sequelize.define('VendasItens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    venda_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vendas', // Nome da tabela associada
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'produtos', // Nome da tabela associada
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    vlrVenda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    }
  }, {
    tableName: 'vendaitens',
    timestamps: false,
  });

  VendasItens.associate = (models) => {
    VendasItens.belongsTo(models.Produtos, {
      foreignKey: 'produto_id',
      as: 'produtos',
    });
    VendasItens.belongsTo(models.Vendas, {
      foreignKey: 'venda_id',
      as: 'vendas',
    });
  };

  module.exports = VendasItens;

