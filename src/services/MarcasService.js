// src/services/MarcaService.js
const Marcas = require('../models/Marcas');

class MarcasService {
  static async criarMarca(dados) {
    const marcaExistente = await Marcas.findOne({ where: { nome: dados.nome } });
    if (marcaExistente) {
      throw new Error(`Marca ${dados.nome} Já Cadastrada`);
    }
    try {
      return await Marcas.create(dados);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async obterTodasMarcas() {
    try {
      return await Marcas.findAll();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async obterMarcaPorId(id) {
    try {
      return await Marcas.findByPk(id);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async atualizarMarca(id, dados) {
    try {
      const [updated] = await Marcas.update(dados, {
        where: { id }
      });
      if (updated) {
        return await Marcas.findByPk(id);
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deletarMarca(id) {
    try {
      return await Marcas.destroy({
        where: { id }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = MarcasService;
