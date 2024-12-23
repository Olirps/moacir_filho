const Produtos = require('../models/Produtos');
const Vendas = require("../models/Vendas");
const VendasItens = require('../models/VendasItens');

class VendasService {
    static async registraVenda(data) {
        // console.log('Entrou no Service: '+JSON.stringify(data))
        const itensVenda = data.products;
        if(data.cliente_id === ''){
            data.cliente_id = 176
        }
        const vendaRegistrada = await Vendas.create(data)

        // Mapeia os itens para associar com o ID da venda registrada
        const itensVendaRegistrada = itensVenda.map((item) => ({
            venda_id: vendaRegistrada.id, // ID da venda registrada
            produto_id: item.id,          // ID do produto vendido
            quantity: parseFloat(item.quantity).toFixed(3), // Quantidade do produto
            vlrVenda: item.total            // Preço do produto
        }));


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

    static async consultaItensPorVenda(id) {
        try {
            // Busca os itens da venda
            let itensVenda = await VendasItens.findAll({
                where: {
                    venda_id: id
                },
                order: [['id', 'ASC']]
            });

            // Enriquecer os itens com o nome do produto (xProd)
            for (let item of itensVenda) {
                const produto = await Produtos.findByPk(item.produto_id);
                if (produto) {
                    item.dataValues.xProd = produto.xProd; // Adiciona o campo xProd ao item
                    item.dataValues.vlrUnitario = produto.vlrVenda; // Adiciona o campo xProd ao item
                }
            }

            return itensVenda;
        } catch (err) {
            throw new Error('Erro ao buscar itens por venda');
        }
    }


}


module.exports = VendasService;
