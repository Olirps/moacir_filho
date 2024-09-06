// controllers/ProdutosNFController.js

const { obterProdutosPorNotaFiscal } = require('../services/ProdutosNFService'); // Ajuste o caminho conforme necessário

// Controller para lidar com a requisição e resposta
const getProdutosPorNotaFiscal = async (req, res) => {
    try {
        const notaFiscalId = req.params.notaFiscalId;
        
        // Obter produtos através do serviço
        const produtos = await obterProdutosPorNotaFiscal(notaFiscalId);

        // Retornar os produtos como resposta
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        res.status(500).send('Erro ao obter produtos');
    }
};

module.exports = {
    getProdutosPorNotaFiscal
};
