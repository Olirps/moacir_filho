// src/services/VeiculosService.js
const Veiculos = require('../models/Veiculos');
const { Op } = require('sequelize');


class VeiculosService {
  static async criarVeiculos(dados) {
    // Verificar se a placa já existe
    dados.placa = dados.placa.replace('-', '').toUpperCase();
    const VeiculosExistente = await Veiculos.findOne({ where: { placa: dados.placa } });
    if (VeiculosExistente) {
      throw new Error('Já existe um Veiculo com esta placa.');
    }

    try {
      return await Veiculos.create(dados);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async obterTodosVeiculos(filtro) {
    try {
      return await Veiculos.findAll({ where: filtro });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async obterVeiculosPorId(id) {
    try {
      return await Veiculos.findByPk(id);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async atualizarVeiculos(id, dados) {
    try {
      // Normalizar a placa (remover hífen e colocar em maiúsculas)
      const novaPlaca = dados.placa.replace('-', '').toUpperCase();

      // Verifica se é um veículo de tipo carro ou moto
      if (dados.tipoveiculoId === 1 || dados.tipoveiculoId === 2) {
        // Verificar se já existe um veículo com essa placa, excluindo o próprio ID
        const placaExistente = await Veiculos.findOne({
          where: {
            placa: novaPlaca,
            id: { [Op.ne]: id } // Garante que não seja o próprio veículo
          }
        });

        if (placaExistente) {
          throw new Error('Já existe um veículo cadastrado com essa placa.');
        }
      }

      // Atualiza os dados no banco
      const [updated] = await Veiculos.update({ ...dados, placa: novaPlaca }, { where: { id } });

      if (updated) {
        return await Veiculos.findByPk(id);
      }

      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  }


  static async deletarVeiculos(id) {
    try {
      return await Veiculos.destroy({
        where: { id }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = VeiculosService;
