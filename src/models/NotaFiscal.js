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
        allowNull: false
    },
    natOp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mod: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    serie: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nNF: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dhEmi: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dhSaiEnt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    tpNF: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idDest: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cMunFG: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tpImp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tpEmis: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cDV: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tpAmb: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    finNFe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    indFinal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    indPres: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    indIntermed: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    procEmi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    verProc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dhCont: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    NFref: {
        type: DataTypes.STRING,
        allowNull: true // Assuming NFref is optional
    },
    xJust: {
        type: DataTypes.STRING(100),
        allowNull: true // Assuming NFref is optional
    }
}, {
  tableName: 'nota_fiscal' // Adjust table name if needed
});

NotaFiscal.belongsTo(Fornecedores, { foreignKey: 'codFornecedor' });


module.exports = NotaFiscal;