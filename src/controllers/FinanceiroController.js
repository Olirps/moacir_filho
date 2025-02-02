const FinanceiroService = require('../services/FinanceiroService');

class FinanceiroController {

    static async createLancamentos(req, res) {
        try {
            const lancamento = await FinanceiroService.createLancamentos(req.body);
            return res.status(201).json(lancamento);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }


    static async getAllLancamentosFinanceiroDespesa(req, res) {
        try {
            const lancamentos = await FinanceiroService.getAllLancamentosFinanceiroDespesa();
            return res.status(200).json(lancamentos);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Buscar um lançamento financeiro de despesa pelo ID
    static async getLancamentoDespesaById(req, res) {
        try {
            const { id } = req.params;
            const lancamento = await FinanceiroService.getLancamentoDespesaById(id);

            if (!lancamento) {
                return res.status(404).json({ message: 'Lançamento não encontrado' });
            }

            return res.status(200).json(lancamento);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    /*static async updateFuncionario(req, res) {
        try {
            const updatedFuncionario = await FuncionariosService.updateFuncionario(req.params.id, req.body);
            if (!updatedFuncionario) {
                return res.status(404).json({ error: 'Funcionario não encontrado' });
            }
            return res.status(200).json(updatedFuncionario);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }*/
}

module.exports = FinanceiroController;