const getInformacoesProduto = (jsonData) => {
    const nfe = jsonData?.nfeProc?.NFe?.[0]?.infNFe?.[0]?.det;

    const getValue = (obj, path, defaultValue = null) => {
        try {
            if (!Array.isArray(path) || path.length === 0) {
                throw new Error('Caminho deve ser um array com pelo menos um elemento');
            }

            return path.reduce((acc, key) => {
                if (acc && typeof acc === 'object' && acc[key] !== undefined) {
                    return acc[key];
                }
                return defaultValue;
            }, obj);
        } catch (error) {
            console.error(`Erro ao acessar o caminho ${path.join(' -> ')}:`, error.message);
            return defaultValue;
        }
    };

    return nfe.map(item => ({
        cProd: getValue(item, ['prod', 0, 'cProd', 0]),
        cEAN: getValue(item, ['prod', 0, 'cEAN', 0]),
        xProd: getValue(item, ['prod', 0, 'xProd', 0]),
        NCM: getValue(item, ['prod', 0, 'NCM', 0]),
        EXTIPI: getValue(item, ['prod', 0, 'EXTIPI', 0]),
        CEST: getValue(item, ['prod', 0, 'CEST', 0]),
        indEscala: getValue(item, ['prod', 0, 'indEscala', 0]),
        CFOP: getValue(item, ['prod', 0, 'CFOP', 0]),
        uCom: getValue(item, ['prod', 0, 'uCom', 0]),
        qCom: getValue(item, ['prod', 0, 'qCom', 0]),
        vUnCom: getValue(item, ['prod', 0, 'vUnCom', 0]),
        vProd: getValue(item, ['prod', 0, 'vProd', 0]),
        cEANTrib: getValue(item, ['prod', 0, 'cEANTrib', 0]),
        uTrib: getValue(item, ['prod', 0, 'uTrib', 0]),
        qTrib: getValue(item, ['prod', 0, 'qTrib', 0]),
        vUnTrib: getValue(item, ['prod', 0, 'vUnTrib', 0]),
        vDesc: getValue(item, ['prod', 0, 'vDesc', 0]),
        indTot: getValue(item, ['prod', 0, 'indTot', 0]),
        cProdANP: getValue(item, ['prod', 0, 'comb', 0, 'cProdANP', 0]),
        descANP: getValue(item, ['prod', 0, 'comb', 0, 'descANP', 0]),
        UFCons: getValue(item, ['prod', 0, 'comb', 0, 'UFCons', 0]),
        nBico: getValue(item, ['prod', 0, 'comb', 0, 'encerrante', 0, 'nBico', 0]),
        nTanque: getValue(item, ['prod', 0, 'comb', 0, 'encerrante', 0, 'nTanque', 0]),
        vEncIni: getValue(item, ['prod', 0, 'comb', 0, 'encerrante', 0, 'vEncIni', 0]),
        vEncFin: getValue(item, ['prod', 0, 'comb', 0, 'encerrante', 0, 'vEncFin', 0]),
        pBio: getValue(item, ['prod', 0, 'comb', 0, 'pBio', 0])
    }));
};

module.exports = getInformacoesProduto;
