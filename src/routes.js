// src/routers.js
const express = require('express');
const router = express.Router();
const VeiculosController = require('./controllers/VeiculosController');
const MarcasController = require('./controllers/MarcasController');
const FornecedoresController = require('./controllers/FornecedoresController');
const LoginController = require('./controllers/LoginController');
const {NotaFiscalController ,handleMulterErrors,upload}= require('./controllers/NotaFiscalController');
const ProdutosController = require('./controllers/ProdutosController');
const authenticateToken = require('./middlewares/authenticateToken'); // Importa o middleware de autenticação
const ProdutosNFController = require('./controllers/ProdutosNFController'); // Ajuste o caminho conforme necessário
const UFMunicipiosController = require('./controllers/UFMunicipiosController'); // Ajuste o caminho conforme necessário



// Aplica o middleware de autenticação globalmente a todas as rotas, exceto as rotas de login e registro

router.post('/auth/register', LoginController.register);
router.post('/auth/login', LoginController.login); // Exclui as rotas de autenticação do middleware


// Aplica o middleware de autenticação para proteger todas as rotas abaixo
router.use(authenticateToken);

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

// Rotas para produtos
router.post('/produtos', ProdutosController.criarProduto);
router.get('/produtos', ProdutosController.listarProdutos);
router.get('/produtos/:id', ProdutosController.obterProdutoPorId);
router.put('/produtos/:id', ProdutosController.atualizarProduto);
router.delete('/produtos/:id', ProdutosController.excluirProduto);

// Rotas para nota fiscal eletronica
router.post('/notafiscalimport',upload.array('xml'),handleMulterErrors,NotaFiscalController.importarNotaFiscal);
router.post('/notafiscal',NotaFiscalController.criarNotaFiscal);
router.get('/notafiscal', NotaFiscalController.listarNotaFiscal);
router.get('/notafiscal/:id', NotaFiscalController.obterNotaFiscalPorId);
router.put('/notafiscal/:id', NotaFiscalController.atualizarNotaFiscal);
router.delete('/notafiscal/:id', NotaFiscalController.excluirNotaFiscal);

// Rotas para produtos nota fiscal
router.get('/produtosnf/:notaFiscalId', ProdutosNFController.getProdutosPorNotaFiscal);
router.put('/produtosnf/vincular/:id', ProdutosNFController.vincularProdutoNF);

//Rotas UFs e Municipios
router.get('/uf', UFMunicipiosController.obterTodasUF);
router.get('/municipios', UFMunicipiosController.obterMunicipiosPorUF);



module.exports = router;
