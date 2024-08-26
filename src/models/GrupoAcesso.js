// models/GrupoAcesso.js
const {  DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importar o Sequelize

const GrupoAcesso = sequelize.define('GrupoAcesso',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    view: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    edit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    insert: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {

    tableName: 'grupo_acessos', // Nome da tabela no banco de dados
    timestamps: false // Se você não deseja incluir colunas de timestamps (createdAt e updatedAt)
});

module.exports = GrupoAcesso;
