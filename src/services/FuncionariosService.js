const Funcionarios = require('../models/Funcionarios');
const Clientes = require('../services/ClientesService');

class FuncionariosService {
    static async createFuncionarios(data) {
        try {

            const pessoaCadastrada = Clientes.criarClientes(data)
            data.cliente_id = pessoaCadastrada.id;
            const funcionario = await Funcionarios.create(data);
            return funcionario;
        } catch (error) {
            throw new Error('Error creating funcionario');
        }
    }

    static async getAllFuncionarios(filtro) {
        try {
            const funcionarios = await Funcionarios.findAll({ where: filtro });
            return funcionarios;
        } catch (error) {
            throw new Error('Error fetching all funcionarios');
        }
    }

    static async getFuncionarioById(id) {
        try {
            const funcionario = await Funcionarios.findByPk(id);
            if (!funcionario) {
                throw new Error('Funcionario not found');
            }
            return funcionario;
        } catch (error) {
            throw new Error('Error fetching GrupoAcesso by ID');
        }
    }
}

module.exports = FuncionariosService;