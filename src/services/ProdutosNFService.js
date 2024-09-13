// services/ProdutosNFService.js
const Produtos = require('../models/Produtos');
const MovimentacoesEstoque = require('../models/MovimentacoesEstoque');
const ItensNaoIdentificados = require('../models/ItensNaoIdentificados');
const { literal } = require('sequelize');


class ProdutosNFService {

    // Função para obter todos os produtos de uma nota fiscal
    static async obterProdutosPorNotaFiscal(nota_id) {
        try {
            // Buscar produtos na tabela ItensNaoIdentificados
            const itensNaoIdentificados = await ItensNaoIdentificados.findAll({
                where: {
                    nota_id,
                    produto_id: null // Verifica se produto_id é null 
                },
                attributes: [
                    'id',
                    'xProd',
                    'qCom',
                    [literal("'0'"), 'nI'] // Inclui o valor fixo '0' para o campo nI

                ] // Ajuste conforme os campos da tabela
            });

            // Buscar produtos cadastrados na tabela Produtos e MovimentacoesEstoque
            const movimentacoesEstoque = await MovimentacoesEstoque.findAll({
                where: { nota_id },
                include: [{
                    model: Produtos,
                    as: 'produto', // Nome da associação deve ser 'produto'
                    attributes: [
                        'id',
                        'xProd',
                        [literal("'1'"), 'nI'] // Inclui o valor fixo '0' para o campo nI
                    ] // Ajuste conforme os campos da tabela Produtos
                }],
                attributes: ['quantidade']
            });

            // Combine os resultados
            const produtos = itensNaoIdentificados.map(item => ({
                id: item.id,
                descricao: item.xProd,
                quantidade: item.qCom, // Ajuste se necessário
                identificador: '0' // Inclua o identificador não identificado

            }));

            movimentacoesEstoque.forEach(movimentacao => {
                const produto = {
                    id: movimentacao.produto.id,
                    descricao: movimentacao.produto.xProd,
                    quantidade: movimentacao.quantidade,
                    identificador: '1' // Inclua o identificador não identificado

                };
                produtos.push(produto);
            });

            return produtos;
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            throw new Error('Erro ao obter produtos');
        }
    };

    static async vincularProdutoNF(produto) {

        try {
            const atualizaEstoque = MovimentacoesEstoque.create(produto);
            const id = produto.prodId
            // Tentar atualizar o registro no banco de dados
            const [updated] = await ItensNaoIdentificados.update({
                where: { id } // Filtro para encontrar o registro pelo ID
            });

            if (updated) {
                // Se o registro foi atualizado, buscar e retornar a pessoa atualizada
                return await ItensNaoIdentificados.findByPk(id);
            }

            // Se não foi atualizado, retornar null
            return null;
        } catch (err) {
            // Lançar um erro com a mensagem original
            throw new Error(err.message);
        }


    }
}


module.exports = ProdutosNFService;
