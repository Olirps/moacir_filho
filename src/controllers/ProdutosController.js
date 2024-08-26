// src/controllers/ProdutosController.js
const ProdutosService = require('../services/ProdutosService');

class ProdutosController {
    // Criação de um novo produto
    static async criarProduto(req, res) {
        try {
            const novoProduto = await ProdutosService.criarProduto(req.body);
            res.status(201).json(novoProduto);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Listagem de todos os produtos
    static async listarProdutos(req, res) {
        try {
            const produtos = await ProdutosService.listarProdutos();
            res.status(200).json(produtos);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Obtenção de um produto por ID
    static async obterProdutoPorId(req, res) {
        try {
            const produto = await ProdutosService.obterProdutoPorId(req.params.id);
            res.status(200).json(produto);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    // Atualização de um produto por ID
    static async atualizarProduto(req, res) {
        try {
            const produtoAtualizado = await ProdutosService.atualizarProduto(req.params.id, req.body);
            res.status(200).json(produtoAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Exclusão de um produto por ID
    static async excluirProduto(req, res) {
        try {
            const mensagem = await ProdutosService.excluirProduto(req.params.id);
            res.status(200).json(mensagem);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }
}

module.exports = ProdutosController;
