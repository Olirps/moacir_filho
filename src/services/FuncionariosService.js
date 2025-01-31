const Funcionarios = require('../models/Funcionarios');
const ClientesModel = require('../models/Clientes');
const Clientes = require('../services/ClientesService');

class FuncionariosService {
    static async createFuncionarios(data) {
        try {
            // Tenta criar o cliente
            const pessoaCadastrada = await Clientes.criarClientes(data);

            if (!pessoaCadastrada) {
                throw new Error('Erro ao criar cliente: Nenhum cliente foi retornado.');
            }

            // Associa o ID do cliente criado ao funcionário
            data.cliente_id = pessoaCadastrada.id;

            // Cria o funcionário
            const funcionario = await Funcionarios.create(data);
            return funcionario;
        } catch (error) {
            // Captura e propaga a mensagem de erro original
            throw new Error(`Erro ao criar funcionário: ${error.message}`);
        }
    }

    static async getAllFuncionarios(filtro) {
        try {
            const funcionarios = await Funcionarios.findAll({ where: filtro });

            const clienteIds = funcionarios.map(funcionario => funcionario.cliente_id);

            const clientes = await ClientesModel.findAll({ where: { id: clienteIds } });

            funcionarios.forEach(funcionario => {
                const cliente = clientes.find(cliente => cliente.id === funcionario.cliente_id);
                if (cliente) {
                    funcionario.dataValues.cliente = cliente;
                }
            });
            return funcionarios;
        } catch (error) {
            throw new Error(`Error fetching all funcionarios: ${error.message}`);
        }
    }

    static async getFuncionarioById(id) {
        try {
            const funcionario = await Funcionarios.findByPk(id);
            const clienteFuncionario = await ClientesModel.findOne({ where: { id: funcionario.cliente_id } });
            if (clienteFuncionario) {
                funcionario.dataValues.cliente = clienteFuncionario;
            }

            if (!funcionario) {
                throw new Error('Funcionario not found');
            }
            return funcionario;
        } catch (error) {
            throw new Error(`Error fetching Funcionario by ID: ${error.message}`);
        }
    }

    static async updateFuncionario(id, data) {
        try {
            const funcionario = await Funcionarios.findByPk(id);

            if (!funcionario) {
                throw new Error('Funcionario not found');
            }

            // Separar os dados de cliente e funcionário
            const clienteData = {
                bairro: data.bairro,
                celular: data.celular,
                cep: data.cep,
                cpfCnpj: data.cpfCnpj,
                email: data.email,
                logradouro: data.logradouro,
                municipio_id: data.municipio_id,
                nome: data.nome,
                numero: data.numero,
                uf_id: data.uf_id
            };

            const funcionarioData = {
                cargo: data.cargo,
                dataContratacao: data.dataContratacao,
                salario: data.salario,
                tipoFuncionario: data.tipoFuncionario
            };

            // Atualizar Cliente e capturar erro, se houver
            try {
                await ClientesModel.update(clienteData, {
                    where: { id: funcionario.cliente_id }
                });
            } catch (error) {
                throw new Error(`Erro ao atualizar Cliente: ${error.message}`);
            }
            // Atualizar Funcionário
            const updatedFuncionario = await funcionario.update(funcionarioData);

            return updatedFuncionario;
        } catch (error) {
            throw new Error(`Error updating Funcionario: ${error.message}`);
        }
    }


}

module.exports = FuncionariosService;