const NotaFiscal = require('../models/NotaFiscal');
const Financeiro = require('../models/Financeiro');
const Clientes = require('../models/Clientes');
const Fornecedores = require('../models/Fornecedores');
const Funcionarios = require('../models/Funcionarios');
const MovimentacaoFinanceira = require('../models/MovimentacaoFinanceira');



class FinanceiroService {
  static async createLancamentos(dadosFinanceiro) {
    try {
      const despesa = await Financeiro.create({
        nota_id: dadosFinanceiro.notaId || null,
        descricao: dadosFinanceiro.descricao,
        tipo: dadosFinanceiro.tipo,
        cliente_id: dadosFinanceiro.cliente_id || null,
        fornecedor_id: dadosFinanceiro.fornecedor_id || null,
        funcionario_id: dadosFinanceiro.funcionario_id || null,
        valor: dadosFinanceiro.valor,
        data_lancamento: dadosFinanceiro.data_lancamento,
        data_vencimento: dadosFinanceiro.dtVencimento,
        status: dadosFinanceiro.status || 'andamento'
      });

      if (dadosFinanceiro.despesaRecorrente) {
        const dtVencimento = new Date(dadosFinanceiro.data_vencimento); // Garante que dtVencimento é um objeto Date
        const qtdParcelas = dadosFinanceiro.lancarParcelas; // Número correto de parcelas

        for (let i = 1; i <= qtdParcelas; i++) {
          const vencimento = new Date(dtVencimento); // Cria uma cópia para evitar mutação
          vencimento.setMonth(vencimento.getMonth() + i - 1); // Ajusta corretamente os meses
          // Garante que o dia do mês seja o mesmo do original
          if (vencimento.getDate() !== dtVencimento.getDate()) {
            vencimento.setDate(0); // Define para o último dia do mês anterior
          }
          const movimentacao = {
            financeiro_id: despesa.id,
            valor_parcela: dadosFinanceiro.valor,
            vencimento,
            descricao: `${dadosFinanceiro.descricao} - Parcela ${i}/${qtdParcelas}`,
            status: 'pendente'
          };
          await MovimentacaoFinanceira.create(movimentacao);
        }
      } else {
        const movimentacao = {
          financeiro_id: despesa.id,
          valor_parcela: dadosFinanceiro.valor,
          vencimento: dadosFinanceiro.data_vencimento,
          descricao: `${dadosFinanceiro.descricao} - Parcela 1 / 1`,
          status: 'pendente'
        };
        await MovimentacaoFinanceira.create(movimentacao);
      }

      return despesa;
    } catch (error) {
      console.error('Erro ao registrar despesa:', error);
      throw new Error('Erro ao registrar despesa');
    }
  }



  static async getAllLancamentosFinanceiroDespesa() {
    try {
      const financeiro = await Financeiro.findAll({
        where: { tipo: 'debito' },
        raw: true, // Transforma os dados em objetos JS puros para evitar problemas com Sequelize
        order: [['id', 'DESC']]
      });

      const financeiroComDetalhes = await Promise.all(financeiro.map(async (lancamento) => {
        let entidade = null;
        let entidadeNome = null;

        if (lancamento.fornecedor_id) {
          entidade = await Fornecedores.findOne({ where: { id: lancamento.fornecedor_id }, raw: true });
          entidadeNome = 'fornecedor';
        } else if (lancamento.funcionario_id) {
          entidade = await Funcionarios.findOne({ where: { id: lancamento.funcionario_id }, raw: true });
          entidadeNome = 'funcionario';
        } else if (lancamento.cliente_id) {
          entidade = await Clientes.findOne({ where: { id: lancamento.cliente_id }, raw: true });
          entidadeNome = 'cliente';
        }

        return {
          ...lancamento,
          [entidadeNome]: entidade
        };
      }));

      return financeiroComDetalhes;
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      throw new Error('Erro ao buscar lançamentos');
    }
  }

  static async getLancamentoDespesaById(id) {
    try {
      const lancamento = await Financeiro.findOne({
        where: { id, tipo: 'debito' },
        raw: true // Para retornar um objeto JavaScript comum
      });

      if (!lancamento) {
        throw new Error('Lançamento financeiro não encontrado');
      }

      let entidade = null;
      let entidadeNome = null;

      if (lancamento.fornecedor_id) {
        entidade = await Fornecedores.findOne({ where: { id: lancamento.fornecedor_id }, raw: true });
        entidadeNome = 'fornecedor';
      } else
        if (lancamento.funcionario_id) {
          entidade = await Funcionarios.findOne({ where: { id: lancamento.funcionario_id }, raw: true });

          // Verifica se o funcionário tem um cliente associado
          if (entidade.cliente_id) {
            const cliente = await Clientes.findOne({ where: { id: entidade.cliente_id }, raw: true });
            entidade.cliente = cliente; // Adiciona o cliente ao objeto do funcionário
          }
          entidadeNome = 'funcionario';
        } else if (lancamento.cliente_id) {
          entidade = await Clientes.findOne({ where: { id: lancamento.cliente_id }, raw: true });
          entidadeNome = 'cliente';
        }

      return {
        ...lancamento,
        [entidadeNome]: entidade
      };
    } catch (error) {
      console.error('Erro ao buscar lançamento:', error);
      throw new Error('Erro ao buscar lançamento financeiro');
    }
  }

  static async createMovimentacaoFinanceira(dadosMovimentacao) {
    try {
      const movimentacao = await MovimentacaoFinanceira.create({
        financeiro_id: dadosMovimentacao.financeiro_id,
        tipo: dadosMovimentacao.tipo,
        valor: dadosMovimentacao.valor,
        data_movimentacao: dadosMovimentacao.data_movimentacao,
        descricao: dadosMovimentacao.descricao
      });

      return movimentacao;
    } catch (error) {
      console.error('Erro ao registrar movimentação financeira:', error);
      throw new Error('Erro ao registrar movimentação financeira');
    }
  }


  static async getMovimentacaoFinanceiraByFinanceiroID(financeiro_id) {
    try {
      const movimentacoes = await MovimentacaoFinanceira.findAll({
        where: { financeiro_id },
        raw: true
      });

      return movimentacoes;
    } catch (error) {
      console.error('Erro ao buscar movimentações financeiras:', error);
      throw new Error('Erro ao buscar movimentações financeiras');
    }
  }

}

module.exports = FinanceiroService;
