const SubgrupoprodutoService = require('../services/SubgrupoprodutoService');
const { Op } = require('sequelize');

class SubgrupoprodutoController {

    // Criação de um novo subgrupo
    static async criarSubgrupoproduto(req, res) {
        try {
            const novoSubgrupo = await SubgrupoprodutoService.criarSubgrupoproduto(req.body);
            res.status(201).json(novoSubgrupo);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Listagem de todos os subgrupos
    static async listarSubgruposProduto(req, res) {
        try {
            const { id, gpid, descricao } = req.query;
            const where = {};

            // Aplica filtro por ID se fornecido
            if (id) {
                where.id = { [Op.like]: `%${id}%` };
            }

            // Aplica filtro por gpid se fornecido
            if (gpid) {
                where.gpid = gpid;
            }

            // Aplica filtro de descrição se fornecido
            if (descricao) {
                where.descricao = { [Op.like]: `%${descricao}%` };
            }

            const subgrupos = await SubgrupoprodutoService.listarSubgruposProduto(where);
            res.status(200).json(subgrupos);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Obtenção de um subgrupo por ID
    static async obterSubgrupoprodutoPorId(req, res) {
        try {
            const subgrupo = await SubgrupoprodutoService.obterSubgrupoprodutoPorId(req.params.id);
            res.status(200).json(subgrupo);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    // Atualização de um subgrupo por ID
    static async atualizarSubgrupoproduto(req, res) {
        try {
            const subgrupoAtualizado = await SubgrupoprodutoService.atualizarSubgrupoproduto(req.params.id, req.body);
            res.status(200).json(subgrupoAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    // Exclusão de um subgrupo por ID
    static async excluirSubgrupoproduto(req, res) {
        try {
            const mensagem = await SubgrupoprodutoService.excluirSubgrupoproduto(req.params.id);
            res.status(200).json(mensagem);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }
}

module.exports = SubgrupoprodutoController;
