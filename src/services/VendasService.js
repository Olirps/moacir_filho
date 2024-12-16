const Produtos = require('../models/Produtos');
const Vendas = require("../models/Vendas");
const VendasItens = require('../models/VendasItens');

class VendasService {
    static async registraVenda(data) {
        // console.log('Entrou no Service: '+JSON.stringify(data))
        const itensVenda = data.products;
        console.log('Produtos Vendidos' + JSON.stringify(data))
        const vendaRegistrada = await Vendas.create(data)

        // Mapeia os itens para associar com o ID da venda registrada
        const itensVendaRegistrada = itensVenda.map((item) => ({
            venda_id: vendaRegistrada.id, // ID da venda registrada
            produto_id: item.id,          // ID do produto vendido
            quantidade: item.quantity,   // Quantidade do produto
            vlrVenda: item.total            // Preço do produto
        }));

        console.log('Itens da Venda Registrada: ' + JSON.stringify(itensVendaRegistrada));

        const itensVendidos = await VendasItens.bulkCreate(itensVendaRegistrada)

        return vendaRegistrada;
    }

    static async consultaVendas() {
        try {
            // Filtra as vendas com status igual a 0 (ativo)
            return await Vendas.findAll({
                where: {
                    status: 0 // Status igual a 0 (ativo)
                },
                order: [['id', 'DESC']] // Ordena pelo ID em ordem decrescente
            });
        } catch (err) {
            throw new Error('Erro ao buscar todas as vendas');
        }
    }


}


module.exports = VendasService;
