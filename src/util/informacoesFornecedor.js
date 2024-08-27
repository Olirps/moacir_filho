const getInformacoesFornecedor = (jsonData) => {

    const nfeFornecedor = jsonData?.nfeProc?.NFe?.[0]?.infNFe?.[0]?.emit;

    if (!nfeFornecedor) {
        throw new Error('Estrutura do JSON não corresponde ao esperado para informações do Fornecedor.');
    }

    return {
        CNPJ: nfeFornecedor?.CNPJ?.[0] || '',
        xNome: nfeFornecedor?.xNome?.[0] || '',
        xFant: nfeFornecedor?.xFant?.[0] || '',
        endereco: {
            xLgr: nfeFornecedor?.enderEmit?.[0]?.xLgr?.[0] || '',
            nro: nfeFornecedor?.enderEmit?.[0]?.nro?.[0] || '',
            xBairro: nfeFornecedor?.enderEmit?.[0]?.xBairro?.[0] || '',
            cMun: nfeFornecedor?.enderEmit?.[0]?.cMun?.[0] || '',
            xMun: nfeFornecedor?.enderEmit?.[0]?.xMun?.[0] || '',
            UF: nfeFornecedor?.enderEmit?.[0]?.UF?.[0] || '',
            CEP: nfeFornecedor?.enderEmit?.[0]?.CEP?.[0] || '',
            cPais: nfeFornecedor?.enderEmit?.[0]?.cPais?.[0] || '',
            xPais: nfeFornecedor?.enderEmit?.[0]?.xPais?.[0] || '',
            fone: nfeFornecedor?.enderEmit?.[0]?.fone?.[0] || ''
        }
    };
};

module.exports = getInformacoesFornecedor;
