// src/services/ClientesService.js
const Clientes = require('../models/Clientes');
const { validarCpf, limpaDocumento, validarCnpj } = require('../util/util');
const { Op } = require('sequelize');



class ClientesService {

  static async criarClientes(dados) {

    let sizeCpfCnpj = (dados.cpfCnpj.replace(/\D/g, '') ?? dados.CNPJ)?.length;

    let cpfCnpjLimpo = "";

    if (sizeCpfCnpj == 11) {
      cpfCnpjLimpo = (dados.cpfCnpj ?? dados.CNPJ)?.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (!validarCpf(cpfCnpjLimpo) & sizeCpfCnpj == 11) {
        throw new Error(`CPF: ${(dados.cpfCnpj ?? dados.CNPJ)} é inválido`);
      }
      const clientesExistente = await Clientes.findOne({ where: { cpfCnpj: cpfCnpjLimpo } });
      if (clientesExistente) {
        throw new Error(`CPF: ${(dados.cpfCnpj ?? dados.CNPJ)} já cadastrado`);
      }
    } else {
      cpfCnpjLimpo = (dados.cpfCnpj ?? dados.CNPJ)?.replace(/\D/g, ''); // Remove caracteres não numéricos

      if (!validarCnpj(cpfCnpjLimpo)) {
        throw new Error(`CNPJ: ${(dados.cpfCnpj ?? dados.CNPJ)} é inválido`);
      }
      const clientesExistente = await Clientes.findOne({ where: { cpfCnpj: cpfCnpjLimpo } });
      if (clientesExistente) {
        throw new Error(`CNPJ: ${(dados.cpfCnpj ?? dados.CNPJ)} já cadastrado`);
      }
    }
    try {
      // Cria novo fornecedores
      const now = new Date();
      const offset = -4 * 60; // O fuso horário de Cuiabá é UTC-4, ou seja, -4 horas de UTC
      now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + offset);

      let createdAt = now.toLocaleString("pt-BR", {
        timeZone: "America/Cuiaba",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false // Para usar o formato de 24 horas
      });

      createdAt = createdAt.replace(",", "");
      const clienteData = {
        ...dados,
        cpfCnpj: (dados.cpfCnpj ?? dados.CNPJ),
        status: '1',
        createdAt: createdAt
      };

      console.log('Dados Para Criar Cliente: '+JSON.stringify(clienteData));
      
      const createdClient = await Clientes.create(clienteData);
      return createdClient
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  static async obterTodosClientes(filtro) {
    try {
      return await Clientes.findAll({ where: filtro });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async obterClientePorId(id) {
    try {
      return await Clientes.findByPk(id);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async atualizarCliente(id, dados) {
    // Processar os dados da pessoa antes de atualizar
    const cliente = limpaDocumento(dados);
    if (cliente.cpfCnpj.length == 11) {
      // Validar o CPF
      if (!validarCpf(cliente.cpfCnpj)) {
        throw new Error(`CPF: ${cliente.cpfCnpj} é inválido`);
      }
    } else {
      // Validar o CPF
      if (!validarCnpj(cliente.cpfCnpj)) {
        throw new Error(`CPF: ${cliente.cpfCnpj} é inválido`);
      }
    }

    const clientesExistente = await Clientes.findOne({ where: { cpfCnpj: cliente.cpfCnpj } });
    if (clientesExistente) {
      if (clientesExistente.id != id) {
        throw new Error(`CPF: ${dados.cpfCnpj} já cadastrado`);
      }
    }

    try {
      // Tentar atualizar o registro no banco de dados
      const [updated] = await Clientes.update(cliente, {
        where: { id } // Filtro para encontrar o registro pelo ID
      });

      if (updated) {
        // Se o registro foi atualizado, buscar e retornar a pessoa atualizada
        return await Clientes.findByPk(id);
      }

      // Se não foi atualizado, retornar null
      return null;
    } catch (err) {
      // Lançar um erro com a mensagem original
      throw new Error(err.message);
    }
  }



  static async deletarCliente(id) {
    try {
      return await Clientes.destroy({
        where: { id }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = ClientesService;