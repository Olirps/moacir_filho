const GrupoProdutoService = require('../services/GrupoProdutoService');

class GrupoProdutoController {

    // Criação de um novo grupo
    static async criarGrupoProduto(req, res) {
        try {
            const novoGrupo = await GrupoProdutoService.criarGrupoProduto(req.body);
            res.status(201).json(novoGrupo);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Listagem de todos os grupos
    static async listarGruposProduto(req, res) {
        try {
            const { id, descricao } = req.query;
            const where = {};

            // Aplica filtro por ID se fornecido
            if (id) {
                where.id = { [Op.like]: `%${id}%` };
            }

            // Aplica filtro de descrição se fornecido
            if (descricao) {
                where.descricao = { [Op.like]: `%${descricao}%` };
            }

            const grupos = await GrupoProdutoService.listarGruposProduto(where);
            res.status(200).json(grupos);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Obtenção de um grupo por ID
    static async obterGrupoProdutoPorId(req, res) {
        try {
            const grupo = await GrupoProdutoService.obterGrupoProdutoPorId(req.params.id);
            res.status(200).json(grupo);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    // Atualização de um grupo por ID
    static async atualizarGrupoProduto(req, res) {
        try {
            const grupoAtualizado = await GrupoProdutoService.atualizarGrupoProduto(req.params.id, req.body);
            res.status(200).json(grupoAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Exclusão de um grupo por ID
    static async excluirGrupoProduto(req, res) {
        try {
            const mensagem = await GrupoProdutoService.excluirGrupoProduto(req.params.id);
            res.status(200).json(mensagem);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }
}

module.exports = GrupoProdutoController;
