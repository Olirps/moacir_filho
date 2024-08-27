const getInformacoesIde = (jsonData) => {

    const nfe = jsonData?.nfeProc?.NFe?.[0]?.infNFe?.[0]?.ide;
    if (!nfe) {
        throw new Error('Estrutura do JSON não corresponde ao esperado para informações IDE.');
    }

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

    return {
        cUF: getValue(nfe, ['cUF', 0]),
        cNF: getValue(nfe, ['cNF', 0]),
        natOp: getValue(nfe, ['natOp', 0]),
        mod: getValue(nfe, ['mod', 0]),
        serie: getValue(nfe, ['serie', 0]),
        nNF: getValue(nfe, ['nNF', 0]),
        dhEmi: getValue(nfe, ['dhEmi', 0]),
        tpNF: getValue(nfe, ['tpNF', 0]),
        idDest: getValue(nfe, ['idDest', 0]),
        cMunFG: getValue(nfe, ['cMunFG', 0]),
        tpImp: getValue(nfe, ['tpImp', 0]),
        tpEmis: getValue(nfe, ['tpEmis', 0]),
        cDV: getValue(nfe, ['cDV', 0]),
        tpAmb: getValue(nfe, ['tpAmb', 0]),
        finNFe: getValue(nfe, ['finNFe', 0]),
        indFinal: getValue(nfe, ['indFinal', 0]),
        indPres: getValue(nfe, ['indPres', 0]),
        indIntermed: getValue(nfe, ['indIntermed', 0]),
        procEmi: getValue(nfe, ['procEmi', 0]),
        verProc: getValue(nfe, ['verProc', 0]),
        dhCont: getValue(nfe, ['dhCont', 0]),
        xJust: getValue(nfe, ['xJust', 0]),
    };
};
module.exports = getInformacoesIde;
