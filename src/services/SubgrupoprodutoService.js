const { Subgrupoproduto } = require('../models/Subgrupoproduto');

class SubgrupoprodutoService {

    static async criarSubgrupoproduto(data) {
        return await Subgrupoproduto.create(data);
    }

    static async listarSubgruposProduto(where) {
        return await Subgrupoproduto.findAll({ where });
    }

    static async obterSubgrupoprodutoPorId(id) {
        return await Subgrupoproduto.findByPk(id);
    }

    static async atualizarSubgrupoproduto(id, data) {
        await Subgrupoproduto.update(data, { where: { id } });
        return await Subgrupoproduto.findByPk(id);
    }

    static async excluirSubgrupoproduto(id) {
        await Subgrupoproduto.destroy({ where: { id } });
        return { mensagem: 'Subgrupoproduto excluído com sucesso' };
    }
}

module.exports = SubgrupoprodutoService;
