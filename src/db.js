const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicialização do Sequelize com configuração do banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Ativa o logging globalmente
    pool: {
      max: 10,
      min: 0,
      acquire: 30000, // Tempo de espera para adquirir uma conexão
      idle: 10000, // Tempo ocioso antes de liberar a conexão
    },
  }
);

// Função para carregar e sincronizar os modelos
const loadModels = async () => {
  try {
    console.log(`Conectando ao banco de dados: ${process.env.DB_NAME}`);
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida ao banco de dados.');

    // Sincronizar os modelos com o banco de dados
    await sequelize.sync({ force: false, alter: false });
    console.log('Modelos sincronizados com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  }
};

// Executar o carregamento dos modelos
loadModels();

module.exports = sequelize;
