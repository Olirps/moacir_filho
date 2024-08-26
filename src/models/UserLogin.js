const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Ajuste o caminho conforme necessário
const GrupoAcesso = require('../models/GrupoAcesso'); // Importar o modelo GrupoAcesso

const UserLogin = sequelize.define('UserLogin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cpfUser: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grupoAcessoId: {
        type: DataTypes.INTEGER,
        references: {
            model: GrupoAcesso, // Nome do modelo referenciado
            key: 'id'
        }
    }
}, {
    tableName: 'user_login', // Nome da tabela no banco de dados
    timestamps: false, // Se você não deseja incluir colunas de timestamps (createdAt e updatedAt)
    defaultScope: {
        rawAttributes: { exclude: ['password'] },
    },
});

// Metodo para validar a senha
UserLogin.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Definindo o relacionamento
UserLogin.belongsTo(GrupoAcesso, { foreignKey: 'grupoAcessoId' });

module.exports = UserLogin;
