const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const NotaFiscal = require('../models/NotaFiscal');
const { dividirNotaFiscal } = require('../util/importaNotaFiscal');
const Fornecedores = require('../models/Fornecedores');
const Produtos = require('../models/Produtos');
const ProdutosService = require('../services/ProdutosService');
const FornecedoresService = require('../services/FornecedoresService');
const getInformacoesProduto = require("../util/informacoesProduto");
const MovimentacoesEstoque = require("../models/MovimentacoesEstoque");

class NotaFiscalService {

  static async criarNotaFiscal(xmlData) {
    try {
      const dadosXml = await dividirNotaFiscal(xmlData);
      let nroNotaFiscal = dadosXml.nNF;
      let cnpjFornecedor = dadosXml.fornecedor.CNPJ;

      const fornecedoresExistente = await Fornecedores.findOne({ where: { cpfCnpj: cnpjFornecedor } });

      if (!fornecedoresExistente) {
        function flattenJson(json) {
          const flattenedJson = {};
          for (const key in json) {
            if (key !== 'endereco') {
              flattenedJson[key] = json[key];
            }
          }
          if (json.endereco) {
            for (const key in json.endereco) {
              flattenedJson[key] = json.endereco[key];
            }
          }
          return flattenedJson;
        }

        const originalJson = dadosXml.fornecedor;

        function normalizeJson(json, mapping) {
          const normalizedJson = {};
          for (const key in json) {
            if (Object.hasOwnProperty.call(json, key)) {
              const newKey = mapping[key] || key;
              normalizedJson[newKey] = json[key];
            }
          }
          return normalizedJson;
        }

        const mapping = {
          "CNPJ": "cpfCnpj",
          "xNome": "nome",
          "xFant": "nomeFantasia",
          "xLgr": "logradouro",
          "nro": "numero",
          "xBairro": "bairro",
          "xMun": "municipio",
          "cMun": "codMunIBGE",
          "UF": "uf",
          "CEP": "cep",
          "fone": "celular"
        }

        const reestruturado = flattenJson(originalJson);
        const normalizedJson = normalizeJson(reestruturado, mapping);

        const FornecedorCreated = await FornecedoresService.criarFornecedores(normalizedJson);
        dadosXml.codFornecedor = FornecedorCreated.id;

      } else {
        const notaFiscalExistente = await existeNF(dadosXml.nNF, fornecedoresExistente.id);
        dadosXml.codFornecedor = fornecedoresExistente.id;
        if (notaFiscalExistente) {
          throw new Error('Nota Fiscal Já Cadastrada.');
        }
      }


      const nfCreated = await NotaFiscal.create(dadosXml);

      xmlData.nota_id = nfCreated.id
      //produtos
      let produtoInfo = getInformacoesProduto(xmlData);

      if (produtoInfo && typeof produtoInfo === 'object') {

        //verifica a quantidade de objetos
        let projetoTamanho = produtoInfo.length
        for(let i = 0 ;i < projetoTamanho; i++){
          produtoInfo[i].nota_id = nfCreated.id;
        }


      } else {
        console.error('Erro: produtoInfo não é um objeto válido.');
      }

      verificarProdutos(produtoInfo);
      //Fim produtos

      return nfCreated
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async criarNotaFiscalManual(dados) {

    const notaFiscalExistente = await existeNF(dados.nNF, dados.codFornecedor);

    if (notaFiscalExistente) {
      throw new Error('Nota Fiscal Já Cadastrada.');
    }

    try {
      return await NotaFiscal.create(dados);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

async function existeNF(nroNf, codFornecedor) {
  const exist = await NotaFiscal.findOne({ where: {nNF: nroNf,codFornecedor: codFornecedor }});
  if (exist){
    return true;
  }else{
    return false;
  }
}


async function atualizaProdutos(dadosJson){
  const exist = await Produtos.findOne({ where: {cEAN: dadosJson.cEAN }});
  if (exist){
    return true;
  }else{
    return false;
  }
}

async function verificarProdutos(produtosJSON) {
  for (let produto of produtosJSON) {
    const { cEAN, nome } = produto;
    const cEANNumber = parseInt(cEAN, 10);

    if (Number.isInteger(cEANNumber)) {
      try {
        const produtoEncontrado = await Produtos.findOne({
          where: { cEAN: cEAN }
        });

        if (produtoEncontrado) {

          produto.produto_id  = produtoEncontrado.id
          produto.tipo_movimentacao  = 'entrada'
          produto.quantidade  = produto.qCom

          //atualiza o estoque do produto !
          const atualizaEstoque = MovimentacoesEstoque.create(produto)

        } else {
          //cadastro o produto novo
          console.log('Dados passados para criar Produto Chamada: '+JSON.stringify(produto));

          ProdutosService.criarProduto(produto);

          console.log(`Produto com cEAN ${cEAN} não encontrado.`);
        }
      } catch (error) {
        console.error(`Erro ao buscar produto com cEAN ${cEAN}:`, error);
      }
    } else {
      console.log(`cEAN para o produto ${nome} não definido.`);
    }
  }
}


module.exports = NotaFiscalService;