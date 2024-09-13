// controllers/ProdutosNFController.js

const ProdutosNFService = require('../services/ProdutosNFService'); // Ajuste o caminho conforme necessário

class ProdutosNFController {

    // Controller para lidar com a requisição e resposta
    static async getProdutosPorNotaFiscal (req, res) {
        try {
            const notaFiscalId = req.params.notaFiscalId;

            // Obter produtos através do serviço
            const produtos = await ProdutosNFService.obterProdutosPorNotaFiscal(notaFiscalId);

            // Retornar os produtos como resposta
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao obter produtos:', error);
            res.status(500).send('Erro ao obter produtos');
        }
    };

    static async vincularProdutoNF (req, res){
        try {
            const produto = req.body;

            // Obter produtos através do serviço
            const produtos = await ProdutosNFService.vincularProdutoNF(produto);

            // Retornar os produtos como resposta
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao vincular produtos:', error);
            res.status(500).send('Erro ao vincular produtos');
        }
    };

}
module.exports = ProdutosNFController;
