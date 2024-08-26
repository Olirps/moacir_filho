async function dividirNotaFiscal(jsonData) {
  try {
    // Verifica se jsonData é um objeto
    if (typeof jsonData !== 'object' || jsonData === null) {
      throw new Error('jsonData deve ser um objeto JSON válido');
    }

    // Certifique-se de que jsonData é um objeto JavaScript
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    // Verifique se a estrutura é a esperada
    const nfe = data.nfeProc?.NFe?.[0]?.infNFe?.[0]?.ide;
    const nfeFornecedor = data.nfeProc?.NFe?.[0]?.infNFe?.[0]?.emit;

    console.log('nfeFornecedor estrutura: ' + JSON.stringify(nfeFornecedor, null, 2));

    if (!nfe || !nfeFornecedor) {
      throw new Error('Estrutura do JSON não corresponde ao esperado.');
    }

    // Função auxiliar para acessar valores com fallback
    const getValue = (obj, path, defaultValue = null) => {
      return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
    };


    function getFornecedorInfo(informacoesFornecedor) {
      return {
        CNPJ: informacoesFornecedor.CNPJ?.[0]|| '',
        xNome: informacoesFornecedor.xNome?.[0]|| '',
        xFant: informacoesFornecedor.xFant?.[0]|| '',
        // ... outros campos
        endereco: {
          xLgr: informacoesFornecedor.enderEmit[0].xLgr?.[0]|| '',
          nro: informacoesFornecedor.enderEmit[0].nro?.[0]|| '',
          xBairro: informacoesFornecedor.enderEmit[0].xBairro?.[0]|| '',
          cMun: informacoesFornecedor.enderEmit[0].cMun?.[0]|| '',
          xMun: informacoesFornecedor.enderEmit[0].xMun?.[0]|| '',
          UF: informacoesFornecedor.enderEmit[0].UF?.[0]|| '',
          CEP: informacoesFornecedor.enderEmit[0].CEP?.[0]|| '',
          cPais: informacoesFornecedor.enderEmit[0].cPais?.[0]|| '',
          xPais: informacoesFornecedor.enderEmit[0].xPais?.[0]|| '',
          fone: informacoesFornecedor.enderEmit[0].fone?.[0]|| '',
          // ... outros campos do endereço
        }
      };
    }

    // Obtendo as informações do ide com fallback
    const informacoesIde = nfe[0] || {};
    const informacoesFornecedor = nfeFornecedor[0] || {};

    // Extraindo informações do emit (fornecedor)
    const fornecedor = getFornecedorInfo(informacoesFornecedor);


    // Extraindo informações da nota fiscal
    const resultado = {
      cUF: getValue(informacoesIde, ['cUF', 0]),
      cNF: getValue(informacoesIde, ['cNF', 0]),
      natOp: getValue(informacoesIde, ['natOp', 0]),
      mod: getValue(informacoesIde, ['mod', 0]),
      serie: getValue(informacoesIde, ['serie', 0]),
      nNF: getValue(informacoesIde, ['nNF', 0]),
      dhEmi: getValue(informacoesIde, ['dhEmi', 0]),
      tpNF: getValue(informacoesIde, ['tpNF', 0]),
      idDest: getValue(informacoesIde, ['idDest', 0]),
      cMunFG: getValue(informacoesIde, ['cMunFG', 0]),
      tpImp: getValue(informacoesIde, ['tpImp', 0]),
      tpEmis: getValue(informacoesIde, ['tpEmis', 0]),
      cDV: getValue(informacoesIde, ['cDV', 0]),
      tpAmb: getValue(informacoesIde, ['tpAmb', 0]),
      finNFe: getValue(informacoesIde, ['finNFe', 0]),
      indFinal: getValue(informacoesIde, ['indFinal', 0]),
      indPres: getValue(informacoesIde, ['indPres', 0]),
      indIntermed: getValue(informacoesIde, ['indIntermed', 0]),
      procEmi: getValue(informacoesIde, ['procEmi', 0]),
      verProc: getValue(informacoesIde, ['verProc', 0]),
      dhCont: getValue(informacoesIde, ['dhCont', 0]),
      xJust: getValue(informacoesIde, ['xJust', 0]),
      fornecedor: fornecedor // Incluindo as informações do fornecedor no resultado
    };

    // Imprimindo as informações para depuração
    console.log('Informações Nota Fiscal: ' + JSON.stringify(resultado, null, 2));

    // Retorne os campos necessários
    return resultado;
  } catch (error) {
    console.error('Erro ao dividir Nota Fiscal:', error);
    throw error; // Lance o erro para ser tratado por quem chamou a função
  }
}

module.exports = {
  dividirNotaFiscal
};
