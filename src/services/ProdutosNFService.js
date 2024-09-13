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
                identificador: '0', // Inclua o identificador não identificado
                nota_id: nota_id


            }));

            movimentacoesEstoque.forEach(movimentacao => {
                const produto = {
                    id: movimentacao.produto.id,
                    descricao: movimentacao.produto.xProd,
                    quantidade: movimentacao.quantidade,
                    identificador: '1', // Inclua o identificador não identificado
                    nota_id: nota_id

                };
                produtos.push(produto);
            });

            return produtos;
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            throw new Error('Erro ao obter produtos');
        }
    };

    static async vincularProdutoNF(id,dadosProduto) {

        try {
            console.log('Entrou no service NI com os seguintes dados: ' + JSON.stringify(dadosProduto));
        
            // Buscar produto por ID
            const produto = await ItensNaoIdentificados.findByPk(id);
            
            // Verificar se o produto foi encontrado
            if (!produto) {
                throw new Error(`Produto com id ${id} não foi encontrado.`);
            }
        
            // Mostrar o produto encontrado (opcional)
            console.log('Produto encontrado: ', produto);
        
            // Atualizar o produto com os novos dados
            await produto.update(dadosProduto);
            console.log('Produto atualizado com os seguintes dados: ' + JSON.stringify(dadosProduto));
        
            // Criar movimentação de estoque com os mesmos dados
            const atualizaEstoque = await MovimentacoesEstoque.create(dadosProduto);
            console.log('Movimentação de estoque criada com sucesso: ', atualizaEstoque);
        
            return true;
        } catch (err) {
            // Exibir a mensagem de erro completa
            console.error('Erro ao atualizar o produto: ', err.message);
            throw new Error(err.message);
        }
        


    }
}


module.exports = ProdutosNFService;
