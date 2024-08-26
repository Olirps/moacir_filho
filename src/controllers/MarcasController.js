// src/controllers/MarcaController.js
const MarcasService = require('../services/MarcasService');

class MarcasController {
  static async criarMarca(req, res) {
    try {
      const marcas = await MarcasService.criarMarca(req.body);
      res.status(201).json(marcas);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterTodasMarcas(req, res) {
    try {
      const marcas = await MarcasService.obterTodasMarcas();
      res.status(200).json(marcas);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterMarcaPorId(req, res) {
    try {
      const marca = await MarcasService.obterMarcaPorId(req.params.id);
      if (marca) {
        res.status(200).json(marca);
      } else {
        res.status(404).json({ error: 'Marca não encontrada' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async atualizarMarca(req, res) {
    try {
      const marca = await MarcasService.atualizarMarca(req.params.id, req.body);
      if (marca) {
        res.status(200).json(marca);
      } else {
        res.status(404).json({ error: 'Marca não encontrada' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deletarMarca(req, res) {
    try {
      const deleted = await MarcasService.deletarMarca(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Marca não encontrada' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = MarcasController;
