const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const NotaFiscal = require('../models/NotaFiscal');
const { dividirNotaFiscal } = require('../util/importaNotaFiscal');
const Fornecedores = require('../models/Fornecedores');
const FornecedoresService = require('../services/FornecedoresService');
const Veiculos = require("../models/Veiculos");

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
        console.log('Dados Xml antes Normalizacao: ' + JSON.stringify(dadosXml.fornecedor, null, 2));

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
        console.log('ForncedorCreated: ' + JSON.stringify(FornecedorCreated.id, null, 2));
        dadosXml.codFornecedor = FornecedorCreated.id;

        console.log('XML com CodFornecedor: ' + JSON.stringify(dadosXml, null, 2));
      } else {
        const notaFiscalExistente = await existeNF(dadosXml.nNF, fornecedoresExistente.id);
        dadosXml.codFornecedor = fornecedoresExistente.id;
        console.log('NF Existente: '+notaFiscalExistente);
        if (notaFiscalExistente) {
          throw new Error('Nota Fiscal Já Cadastrada.');
        }
      }

      console.log('Dados Xml para criação do NFe: ' + JSON.stringify(dadosXml, null, 2));
      return await NotaFiscal.create(dadosXml);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async criarNotaFiscalManual(dados) {

    console.log('Entrou no dados: '+JSON.stringify(dados))
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

module.exports = NotaFiscalService;