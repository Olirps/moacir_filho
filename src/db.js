// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});


sequelize.authenticate()
  .then(() => {
    console.log(`Conexão bem-sucedida ao banco de dados: ${process.env.DB_NAME}`);

    const sequelize = require('./db'); // Ajuste o caminho conforme necessário
    const GrupoAcesso = require('./models/GrupoAcesso'); // Ajuste o caminho conforme necessário
    const UserLogin = require('./models/UserLogin'); // Ajuste o caminho conforme necessário
    const Produtos = require('./models/Produtos'); // Ajuste o caminho conforme necessário
    const Marcas = require('./models/Marcas'); // Ajuste o caminho conforme necessário
    const UF = require('./models/UF'); // Ajuste o caminho conforme necessário
    const Municipio = require('./models/Municipio'); // Ajuste o caminho conforme necessário
    const ImpostoProduto = require('./models/ImpostoProduto'); // Ajuste o caminho conforme necessário
    const MovimentacoesEstoque= require('./models/MovimentacoesEstoque'); // Ajuste o caminho conforme necessário
    const ItensNaoIdentificados= require('./models/ItensNaoIdentificados.js'); // Ajuste o caminho conforme necessário


    // Sincronizar os modelos com o banco de dados
    sequelize.sync({ force: false})
    .then(() => {
      console.log("Modelos sincronizados com sucesso.");
      })
      .catch(error => {
        console.error("Erro ao sincronizar os modelos:", error);
      });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = sequelize;