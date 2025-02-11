const NotaFiscal = require('../models/NotaFiscal');
const Financeiro = require('../models/Financeiro');
const Clientes = require('../models/Clientes');
const Fornecedores = require('../models/Fornecedores');
const Funcionarios = require('../models/Funcionarios');
const MovimentacaoFinanceira = require('../models/MovimentacaoFinanceira');
const { Op } = require('sequelize');
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../db');




class ContasPagasService {

    static async getContasPagas() {
        try {
            const hoje = new Date();
            const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

            // Se não for segunda-feira, ajustar para a última segunda
            if (diaSemana !== 1) {
                const diferenca = diaSemana === 0 ? 6 : diaSemana - 1; // Se for domingo, volta 6 dias
                hoje.setDate(hoje.getDate() - diferenca);
            }

            const segundaFeira = hoje.toISOString().split('T')[0];

            const umaSemanaDepois = new Date(hoje);
            umaSemanaDepois.setDate(hoje.getDate() + 6); // Pegamos até domingo
            const domingo = umaSemanaDepois.toISOString().split('T')[0];

            const query = `
                SELECT mf.*,cb.nome
                FROM dbgerencialmoacir.financeiro fi
                INNER JOIN dbgerencialmoacir.movimentacaofinanceira mf ON mf.financeiro_id = fi.id
                inner join dbgerencialmoacir.contasbancarias cb on cb.id = mf.conta_id
                WHERE fi.tipo = 'debito'AND mf.status = 'liquidado'
                order by mf.data_pagamento desc
            `;

            const contas = await sequelize.query(query, {
                replacements: { segundaFeira, domingo },
                type: QueryTypes.SELECT
            });

            return contas;
        } catch (error) {
            console.error('Erro ao buscar contas a pagar da semana:', error);
            throw new Error('Erro ao buscar contas a pagar da semana');
        }
    }

}

module.exports = ContasPagasService;
