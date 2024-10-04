const UFMunicipiosService = require('../services/UFMunicipiosService');
const { Op } = require('sequelize');

class UFMunicipiosController {
  static async obterTodasUF(req, res) {
    try {
      const ufs = await UFMunicipiosService.obterTodasUfs();
      res.status(200).json(ufs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterTodosMunicipios(req, res) {
    try {
      const municipios = await UFMunicipiosService.obterTodosMunicipios();
      res.status(200).json(municipios);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterMunicipiosPorUF(req, res) {
    try {

      const municipios = await UFMunicipiosService.obterMunicipiosPorUF(req.params.codUfId);
      if (municipios) {
        res.status(200).json(municipios);
      } else {
        res.status(404).json({ error: 'Municipios não encontrados' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterUFPorId(req, res) {
    console.log('entrou controler antes do try: ' + JSON.stringify(req.params.id, req.body))
    try {
      const codIBGE = { codIBGE: req.params.id }
      console.log('entrou controler: ' + JSON.stringify(codIBGE))
      const uf = await UFMunicipiosService.obterUFPorId(codIBGE);
      if (uf) {
        res.status(200).json(uf);
      } else {
        res.status(404).json({ error: 'UF não encontrados' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async obterMunicipioPorId(req, res) {
    console.log('entrou controler antes do try: ' + JSON.stringify(req.params.id, req.body))
    try {
      const codMunIBGE = { codMunIBGE: req.params.id }
      console.log('entrou controler: ' + JSON.stringify(codMunIBGE))
      const municipios = await UFMunicipiosService.obterMunicipioPorId(codMunIBGE);
      if (municipios) {
        res.status(200).json(municipios);
      } else {
        res.status(404).json({ error: 'Municipios não encontrados' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

}

module.exports = UFMunicipiosController;