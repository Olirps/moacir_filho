const { GrupoProduto } = require('../models/GrupoProduto');

class GrupoProdutoService {

    static async criarGrupoProduto(data) {
        return await GrupoProduto.create(data);
    }

    static async listarGruposProduto(where) {
        return await GrupoProduto.findAll({ where });
    }

    static async obterGrupoProdutoPorId(id) {
        return await GrupoProduto.findByPk(id);
    }

    static async atualizarGrupoProduto(id, data) {
        await GrupoProduto.update(data, { where: { id } });
        return await GrupoProduto.findByPk(id);
    }

    static async excluirGrupoProduto(id) {
        await GrupoProduto.destroy({ where: { id } });
        return { mensagem: 'GrupoProduto excluído com sucesso' };
    }
}

module.exports = GrupoProdutoService;
