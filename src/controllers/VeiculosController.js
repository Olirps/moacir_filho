// src/controllers/VeiculosController.js
const VeiculosService = require('../services/VeiculosService');
const { Op } = require('sequelize');


class VeiculosController {
  static async criarVeiculos(req, res) {
    try {
      const veiculos = await VeiculosService.criarVeiculos(req.body);
      res.status(201).json(veiculos);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterTodosVeiculos(req, res) {
    const { placa } = req.query; // Obtém os parâmetros da requisição
      const where = {};
      if (placa) where.placa =  { [Op.like]: `%${placa}%` };
    try {
      const Veiculos = await VeiculosService.obterTodosVeiculos(where);
      res.status(200).json(Veiculos);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterVeiculosPorId(req, res) {
    try {
      const veiculos = await VeiculosService.obterVeiculosPorId(req.params.id);
      if (veiculos) {
        res.status(200).json(veiculos);
      } else {
        res.status(404).json({ error: 'Veiculo não encontrado' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async atualizarVeiculos(req, res) {
    try {
      const veiculos = await VeiculosService.atualizarVeiculos(req.params.id, req.body);
      if (veiculos) {
        res.status(200).json(veiculos);
      } else {
        res.status(404).json({ error: 'Veiculo não encontrado' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deletarVeiculos(req, res) {
    try {
      const deleted = await VeiculosService.deletarVeiculos(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Veiculo não encontrado' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = VeiculosController;
