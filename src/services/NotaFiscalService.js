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
const ItensNaoIdentificados = require("../models/ItensNaoIdentificados");

class NotaFiscalService {

  static async criarNotaFiscal(xmlData,quantidadeNf) {
    const transaction = await sequelize.transaction();
    try {
      const notasFiscais = xmlData.nfeProc.NFe;
      const jsonEntrada = notasFiscais.length;
      console.log('tamanho json de entrada no service: ' + jsonEntrada);

      const dadosXml = await dividirNotaFiscal(xmlData);

      const fornecedoresExistente = await Fornecedores.findOne({
        where: { cpfCnpj: dadosXml.fornecedor.CNPJ }
      });

      if (!fornecedoresExistente) {
        const originalJson = dadosXml.fornecedor;
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
        };

        const normalizedJson = normalizeJson(flattenJson(originalJson), mapping);

        const fornecedorCreated = await FornecedoresService.criarFornecedores(normalizedJson);
        dadosXml.codFornecedor = fornecedorCreated.id;

      } else {
        const notaFiscalExistente = await existeNF(dadosXml.nNF, fornecedoresExistente.id);
        dadosXml.codFornecedor = fornecedoresExistente.id;

        if (notaFiscalExistente) {
          throw new Error('Nota Fiscal Já Cadastrada.');
        }
      }

      const nfCreated = await NotaFiscal.create(dadosXml, { transaction });

      let produtoInfo = getInformacoesProduto(xmlData);

      if (produtoInfo && typeof produtoInfo === 'object') {
        for (let i = 0; i < produtoInfo.length; i++) {
          produtoInfo[i].nota_id = nfCreated.id;
        }
      } else {
        console.error('Erro: produtoInfo não é um objeto válido.');
      }

      await verificarProdutos(produtoInfo, transaction);

      await transaction.commit();
      return nfCreated;
    } catch (err) {
      await transaction.rollback();
      throw new Error(err.message);
    }
  }

  static async criarNotaFiscalManual(dados) {
    const transaction = await sequelize.transaction();
    try {
      const notaFiscalExistente = await existeNF(dados.nNF, dados.codFornecedor);

      if (notaFiscalExistente) {
        throw new Error('Nota Fiscal Já Cadastrada.');
      }

      const nfCreated = await NotaFiscal.create(dados, { transaction });
      await transaction.commit();
      return nfCreated;
    } catch (err) {
      await transaction.rollback();
      throw new Error(err.message);
    }
  }
}

async function existeNF(nroNf, codFornecedor) {
  const exist = await NotaFiscal.findOne({
    where: { nNF: nroNf, codFornecedor: codFornecedor }
  });
  return exist ? true : false;
}

async function verificarProdutos(produtosJSON, transaction) {
  for (let produto of produtosJSON) {
    const { cEAN, nome } = produto;
    const cEANNumber = parseInt(cEAN, 10);

    if (Number.isInteger(cEANNumber)) {
      try {
        const produtoEncontrado = await Produtos.findOne({
          where: { cEAN: cEAN }
        });

        if (produtoEncontrado) {
          produto.produto_id = produtoEncontrado.id;
          produto.tipo_movimentacao = 'entrada';
          produto.quantidade = produto.qCom;

          await MovimentacoesEstoque.create(produto, { transaction });

        } else {
          await ProdutosService.criarProduto(produto, transaction);
          console.log(`Produto com cEAN ${cEAN} não encontrado.`);
        }
      } catch (error) {
        console.error(`Erro ao buscar produto com cEAN ${cEAN}:`, error);
      }
    } else {
      await ItensNaoIdentificados.create(produto, { transaction });
      console.log(`cEAN para o produto ${nome} não definido.`);
    }
  }
}

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

module.exports = NotaFiscalService;
