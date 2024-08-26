// src/services/ProdutosService.js
const Produtos = require('../models/Produtos');

class ProdutosService {
    // Cria um novo produto
    static async criarProduto(dadosProduto) {
        try {
            const produtoExistente = await Produtos.findOne({ where: { cEAN: dadosProduto.cEAN } });

            if (produtoExistente) {
                throw new Error(`Produto: ${(dadosProduto.cEAN)} já cadastrado`);
              }

            const produto = await Produtos.create(dadosProduto);
            return produto;
        } catch (error) {
            throw new Error('Erro ao criar o produto: ' + error.message);
        }
    }

    // Obtém todos os produtos
    static async listarProdutos() {
        try {
            return await Produtos.findAll();
        } catch (error) {
            throw new Error('Erro ao listar os produtos: ' + error.message);
        }
    }

    // Obtém um produto por ID
    static async obterProdutoPorId(id) {
        try {
            const produto = await Produtos.findByPk(id);
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            return produto;
        } catch (error) {
            throw new Error('Erro ao obter o produto: ' + error.message);
        }
    }

    // Atualiza um produto por ID
    static async atualizarProduto(id, dadosAtualizados) {
        try {
            const produto = await Produtos.findByPk(id);
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            await produto.update(dadosAtualizados);
            return produto;
        } catch (error) {
            throw new Error('Erro ao atualizar o produto: ' + error.message);
        }
    }

    // Exclui um produto por ID
    static async excluirProduto(id) {
        try {
            const produto = await Produtos.findByPk(id);
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            await produto.destroy();
            return { mensagem: 'Produto excluído com sucesso' };
        } catch (error) {
            throw new Error('Erro ao excluir o produto: ' + error.message);
        }
    }
}

module.exports = ProdutosService;
