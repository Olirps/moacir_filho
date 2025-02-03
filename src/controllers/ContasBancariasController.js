const ContasBancariasService = require('../services/ContasBancariasService');


class ContasBancariasController {
    static async getAllContas(req, res) {
        try {
            const bancos = await ContasBancariasService.getAllContas();
            return res.status(200).json(bancos);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async createContaBancaria(req, res) {
        try {
            const conta = await ContasBancariasService.createContaBancaria(req.body);
            return res.status(201).json(conta);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}


module.exports = ContasBancariasController;
