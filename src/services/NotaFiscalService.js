const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const { Mutex } = require('async-mutex');
const mutex = new Mutex();
const NotaFiscal = require('../models/NotaFiscal');
const { dividirNotaFiscal } = require('../util/importaNotaFiscal');
const Fornecedores = require('../models/Fornecedores');
const Produtos = require('../models/Produtos');
const ProdutosService = require('../services/ProdutosService');
const FornecedoresService = require('../services/FornecedoresService');
const getInformacoesProduto = require("../util/informacoesProduto");
const MovimentacoesEstoque = require("../models/MovimentacoesEstoque");
const ItensNaoIdentificados = require("../models/ItensNaoIdentificados");

const fornecedoresCriados = [];
let fornecedorCreated;

class NotaFiscalService {
  static async criarNotaFiscal(xmlData, quantidadeNf) {
    //const transaction = await sequelize.transaction();
    
    try {

      const notasFiscais = xmlData.nfeProc.NFe;
      const jsonEntrada = notasFiscais.length;
      const dadosXml = await dividirNotaFiscal(xmlData);

      // Verifica se o fornecedor já existe
      let fornecedor;
      await mutex.runExclusive(async () => {
        fornecedor = await Fornecedores.findOne({ where: { cpfCnpj: dadosXml.fornecedor.CNPJ } });
        
        if (!fornecedor) {
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
          console.log('Fornecedor não encontrado. Criando novo fornecedor...');
          
          fornecedorCreated = await FornecedoresService.criarFornecedores(normalizedJson);
          adicionarFornecedor(fornecedorCreated.cpfCnpj);
          dadosXml.codFornecedor = fornecedorCreated.id;
        } else {
          dadosXml.codFornecedor = fornecedor.id;
        }
      });

      // Verifica se a nota fiscal já existe
      const notaFiscalExistente = await existeNF(dadosXml.informacoesIde.nNF, dadosXml.codFornecedor);
      if (notaFiscalExistente) {
        throw new Error('Nota Fiscal Já Cadastrada.');
      }

      // Cria a nota fiscal
      console.log('Criando Nota Fiscal...');
      let jsonCreateNF = dadosXml.informacoesIde;
      jsonCreateNF.codFornecedor = dadosXml.codFornecedor;
      const nfCreated = await NotaFiscal.create(jsonCreateNF);
      console.log('Nota Fiscal criada:', nfCreated.id);
      // Processa produtos associados
      let produtoInfo = getInformacoesProduto(xmlData);

      if (produtoInfo && typeof produtoInfo === 'object') {
        produtoInfo.forEach(produto => {
          produto.nota_id = nfCreated.id;
        });
      } else {
        console.error('Erro: produtoInfo não é um objeto válido.');
      }

      await verificarProdutos(produtoInfo);

      //await transaction.commit();
      return nfCreated;
    } catch (err) {
      //await transaction.rollback();
      throw new Error(err.message);
    }
  }

  static async criarNotaFiscalManual(dados) {
    //const transaction = await sequelize.transaction();
    try {
      const notaFiscalExistente = await existeNF(dados.nNF, dados.codFornecedor);
      if (notaFiscalExistente) {
        throw new Error('Nota Fiscal Já Cadastrada.');
      }

      const nfCreated = await NotaFiscal.create(dados);
      //await transaction.commit();
      return nfCreated;
    } catch (err) {
      //await transaction.rollback();
      throw new Error(err.message);
    }
  }

  // Métodos de CRUD para Nota Fiscal
  static async getAllNotasFiscais() {
    try {
      return await NotaFiscal.findAll();
    } catch (err) {
      throw new Error('Erro ao buscar todas as notas fiscais');
    }
  }

  static async getNotaFiscalById(id) {
    try {
      return await NotaFiscal.findByPk(id);
    } catch (err) {
      throw new Error('Erro ao buscar a nota fiscal por ID');
    }
  }

  static async updateNotaFiscal(id, notaFiscalData) {
    try {
      const notaFiscal = await NotaFiscal.findByPk(id);
      if (!notaFiscal) {
        return null;
      }
      return await notaFiscal.update(notaFiscalData);
    } catch (err) {
      throw new Error('Erro ao atualizar a nota fiscal');
    }
  }

  static async deleteNotaFiscal(id) {
    try {
      const notaFiscal = await NotaFiscal.findByPk(id);
      if (!notaFiscal) {
        return null;
      }
      await notaFiscal.destroy();
      return true;
    } catch (err) {
      throw new Error('Erro ao deletar a nota fiscal');
    }
  }
}

async function existeNF(nroNf, codFornecedor) {
  const exist = await NotaFiscal.findOne({
    where: { nNF: nroNf, codFornecedor: codFornecedor }
  });
  return !!exist;
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
          produto.produto_id = produtoEncontrado.id;
          produto.tipo_movimentacao = 'entrada';
          produto.quantidade = produto.qCom;
          console.log(JSON.stringify(produto));
          await MovimentacoesEstoque.create(produto);
        } else {
          console.log(JSON.stringify(produto))
          let prodConsolidado = consolidarProdutosPorCEAN(produto)
          await ProdutosService.criarProduto(produto);
          console.log(`Produto com cEAN ${cEAN} não encontrado.`);
        }
      } catch (error) {
        console.error(`Erro ao buscar produto com cEAN ${cEAN}:`, error);
      }
    } else {
      await ItensNaoIdentificados.create(produto);
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

async function adicionarFornecedor(cnpj) {
  if (!fornecedoresCriados.includes(cnpj)) {
    fornecedoresCriados.push(cnpj);
    console.log('Fornecedor adicionado:', cnpj);
  } else {
    console.log('Fornecedor já existe no array:', cnpj);
  }
  return fornecedoresCriados;
}


async function consolidarProdutosPorCEAN(produto) {
  const produtosConsolidados = {};
  
  const { cEAN, qCom, vProd } = produto;
  
  if (!produtosConsolidados[cEAN]) {
    produtosConsolidados[cEAN] = { qCom: 0, vProd: 0 };
  }
  
  produtosConsolidados[cEAN].qCom += qCom;
  produtosConsolidados[cEAN].vProd += vProd;
  
  return produtosConsolidados;
}

module.exports = NotaFiscalService;
