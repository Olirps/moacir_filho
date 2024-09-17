// src/services/ProdutosService.js
const Produtos = require('../models/Produtos');
const MovimentacoesEstoque = require("../models/MovimentacoesEstoque");
const ItensNaoIdentificados = require('../models/ItensNaoIdentificados');


class ProdutosService {
    // Cria um novo produto
    static async criarProduto(dadosProduto) {
        try {
            let produto = {};
            let prodOri_nf = 0;
            let qCom = 0;

            if (dadosProduto.produto_ori_id){
                const itensNaoIdentificados = await ItensNaoIdentificados.findOne({where: {id: dadosProduto.produto_ori_id}
                });
                prodOri_nf = itensNaoIdentificados.nota_id;
                qCom = itensNaoIdentificados.qCom;
                console.log('itensNaoIdentificados: '+ JSON.stringify(itensNaoIdentificados))
                produto = await Produtos.create({
                    cProd: itensNaoIdentificados.cProd,
                    cEAN: itensNaoIdentificados.cEAN,
                    xProd: itensNaoIdentificados.xProd,
                    NCM: itensNaoIdentificados.NCM,
                    CFOP: itensNaoIdentificados.CFOP,
                    uCom: itensNaoIdentificados.uCom,
                    qCom: itensNaoIdentificados.qCom,
                    vUnCom: itensNaoIdentificados.vUnCom,
                    vProd: itensNaoIdentificados.vProd,
                    validade: itensNaoIdentificados.validade,
                    qtdMinima: itensNaoIdentificados.qtdMinima,
                    marca: itensNaoIdentificados.marca,
                    EXTIPI: itensNaoIdentificados.EXTIPI,
                    CEST: itensNaoIdentificados.CEST,
                    indEscala: itensNaoIdentificados.indEscala,
                    cEANTrib: itensNaoIdentificados.cEANTrib,
                    uTrib: itensNaoIdentificados.uTrib,
                    qTrib: itensNaoIdentificados.qTrib,
                    vUnTrib: itensNaoIdentificados.vUnTrib,
                    vDesc: itensNaoIdentificados.vDesc,
                    indTot: itensNaoIdentificados.indTot,
                    cProdANP: itensNaoIdentificados.cProdANP,
                    descANP: itensNaoIdentificados.descANP,
                    UFCons: itensNaoIdentificados.UFCons,
                    nBico: itensNaoIdentificados.nBico,
                    nTanque: itensNaoIdentificados.nTanque,
                    vEncIni: itensNaoIdentificados.vEncIni,
                    vEncFin: itensNaoIdentificados.vEncFin,
                    pBio: itensNaoIdentificados.pBio
                });
                
                if (prodOri_nf) {
                    dadosProduto.nota_id = prodOri_nf
                    dadosProduto.produto_id = produto.id;
                    dadosProduto.tipo_movimentacao = 'entrada'
                    dadosProduto.quantidade = qCom
                    const atualizaEstoque = MovimentacoesEstoque.create(dadosProduto);
                }
    
            }else{
                const produtoExistente = await Produtos.findOne({ where: { cEAN: dadosProduto.cEAN } });
                if (produtoExistente) {
                    throw new Error(`Produto: ${(dadosProduto.cEAN)} já cadastrado`);
                }
    
                produto = await Produtos.create(dadosProduto);
            if (dadosProduto.nota_id) {
                dadosProduto.produto_id = produto.id;
                dadosProduto.tipo_movimentacao = 'entrada'
                dadosProduto.quantidade = dadosProduto.qCom
                const atualizaEstoque = MovimentacoesEstoque.create(dadosProduto);
            }
            }

            return produto;
        } catch (error) {
            throw new Error('Erro ao criar o produto: ' + error.message);
        }
    }

    // Obtém todos os produtos
    static async listarProdutos(filtro) {
        try {
            return await Produtos.findAll({ where: filtro });
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

// Função para filtrar campos não presentes no modelo
function filterValidAttributes(model, data) {
    const validFields = Object.keys(model.rawAttributes); // Pega os campos definidos no modelo
    return Object.fromEntries(
        Object.entries(data).filter(([key]) => validFields.includes(key))
    );
}

module.exports = ProdutosService;
