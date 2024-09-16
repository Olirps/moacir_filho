const UFMunicipiosService = require('../services/UFMunicipiosService');

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
}

module.exports = UFMunicipiosController;