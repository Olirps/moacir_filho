const ContasBancarias = require('../models/ContasBancarias');

class ContasBancariasSercice {

    static async getAllContas() {
      try {
        return await ContasBancarias.findAll();
      } catch (error) {
        throw new Error(`Erro ao buscar bancos: ${error.message}`);
      }
    }

    static async createContaBancaria(contaBancariaData) {
      try {
        const novaContaBancaria = await ContasBancarias.create(contaBancariaData);
        return novaContaBancaria;
      } catch (error) {
        throw new Error(`Erro ao criar conta bancária: ${error.message}`);
      }
    }
  }
  
  module.exports = ContasBancariasSercice;