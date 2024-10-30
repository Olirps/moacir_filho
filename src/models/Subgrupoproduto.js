module.exports = (sequelize, DataTypes) => {
    const Subgrupoproduto = sequelize.define('Subgrupoproduto', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      gpid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'grupoproduto',
          key: 'id',
        },
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'subgrupoproduto',
      timestamps: false,
    });
  
    Subgrupoproduto.associate = (models) => {
        Subgrupoproduto.belongsTo(models.GrupoProduto, {
        foreignKey: 'gpid',
        as: 'grupoproduto',
      });
    };
  
    return Subgrupoproduto;
  };
  