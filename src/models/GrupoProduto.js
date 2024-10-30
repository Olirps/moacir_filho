module.exports = (sequelize, DataTypes) => {
    const GrupoProduto = sequelize.define('GrupoProduto', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'grupoproduto',
      timestamps: false,
    });
  
    GrupoProduto.associate = (models) => {
      GrupoProduto.hasMany(models.Subgrupoproduto, {
        foreignKey: 'gpid',
        as: 'subgruposprodutos',
      });
    };
  
    return GrupoProduto;
  };
  