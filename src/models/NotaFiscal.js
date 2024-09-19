const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Fornecedores = require('../models/Fornecedores');


const NotaFiscal = sequelize.define('NotaFiscal', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cUF: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    codFornecedor: {
        type: DataTypes.INTEGER,
        references: {
            model: Fornecedores,
            key: 'id',
        },
        allowNull: false,
    },
    cNF: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    natOp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mod: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    serie: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nNF: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dhEmi: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dhSaiEnt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    tpNF: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idDest: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cMunFG: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tpImp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tpEmis: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cDV: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tpAmb: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    finNFe: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    indFinal: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    indPres: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    indIntermed: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    procEmi: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    verProc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dhCont: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    NFref: {
        type: DataTypes.STRING,
        allowNull: true // Assuming NFref is optional
    },
    vNF: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false // Assuming NFref is optional
    },
    xJust: {
        type: DataTypes.STRING(100),
        allowNull: true // Assuming NFref is optional
    },
    lancto: {
        type: DataTypes.ENUM('automatico', 'manual'),
        allowNull: true // Assuming NFref is optional
    },
    status: {
        type: DataTypes.ENUM('aberta', 'andamento','fechada','cancelada'),
        allowNull: true // Assuming NFref is optional
    }
}, {
  tableName: 'nota_fiscal' // Adjust table name if needed
});

NotaFiscal.belongsTo(Fornecedores, { foreignKey: 'codFornecedor' });


module.exports = NotaFiscal;