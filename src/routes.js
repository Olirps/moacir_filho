// src/routers.js
const express = require('express');
const router = express.Router();
const VeiculosController = require('./controllers/VeiculosController');
const MarcasController = require('./controllers/MarcasController');
const FornecedoresController = require('./controllers/FornecedoresController');
const LoginController = require('./controllers/LoginController');
const {NotaFiscalController ,handleMulterErrors,upload}= require('./controllers/NotaFiscalController');
const ProdutosController = require('./controllers/ProdutosController');


const multer = require('multer');


// Se você quiser armazenar o arquivo na memória ao invés do sistema de arquivos


// Rotas para manipulação de Veiculos
router.post('/veiculos', VeiculosController.criarVeiculos);
router.get('/veiculos', VeiculosController.obterTodosVeiculos);
router.get('/veiculos/:id', VeiculosController.obterVeiculosPorId);
router.put('/veiculos/:id', VeiculosController.atualizarVeiculos);
router.delete('/veiculos/:id', VeiculosController.deletarVeiculos);


// Rotas para marcas
router.post('/marcas', MarcasController.criarMarca);
router.get('/marcas', MarcasController.obterTodasMarcas);
router.get('/marcas/:id', MarcasController.obterMarcaPorId);
router.put('/marcas/:id', MarcasController.atualizarMarca);
router.delete('/marcas/:id', MarcasController.deletarMarca);

// Rotas para fornecedores
router.post('/fornecedores', FornecedoresController.criarFornecedores);
router.get('/fornecedores', FornecedoresController.obterTodasFornecedores);
router.get('/fornecedores/:id', FornecedoresController.obterFornecedoresPorId);
router.put('/fornecedores/:id', FornecedoresController.atualizarFornecedores);
router.delete('/fornecedores/:id', FornecedoresController.deletarFornecedores);

// Rotas para login
router.post('/auth/register', LoginController.register);
router.post('/auth/login', LoginController.login);

// Rotas para nota fiscal
router.post('/importanf',upload.array('xml'),handleMulterErrors,NotaFiscalController.importarNotaFiscal);
router.post('/criarnf',NotaFiscalController.criarNotaFiscal);

// Rotas para produtos
router.post('/produtos', ProdutosController.criarProduto);
router.get('/produtos', ProdutosController.listarProdutos);
router.get('/produtos/:id', ProdutosController.obterProdutoPorId);
router.put('/produtos/:id', ProdutosController.atualizarProduto);
router.delete('/produtos/:id', ProdutosController.excluirProduto);

module.exports = router;
