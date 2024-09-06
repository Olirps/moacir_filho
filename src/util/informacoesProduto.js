function getInformacoesProduto(notaFiscal) {
    let produtos = notaFiscal?.nfeProc?.NFe?.infNFe?.det;
    console.log(JSON.stringify(produtos));
    // Verifica se 'produtos' é um array ou um único objeto
    const detalhesProdutos = Array.isArray(produtos) ? produtos : [produtos];

    // Verifica se o campo "prod" é um array ou um objeto
    if (!Array.isArray(produtos)) {
        produtos = [produtos]; // Se for um objeto, transforma em array
        console.log(JSON.stringify(produtos));
    }

    // Mapeia e extrai as informações de cada produto
    return detalhesProdutos.map((produto) => {
        const { prod } = produto; // Acessa a chave 'prod' dentro de cada objeto do array

        // Retorna o objeto com as informações do produto ou 'undefined' se alguma chave não existir
        return {
            cProd: prod?.cProd,
            cEAN: prod?.cEAN,
            xProd: prod?.xProd,
            NCM: prod?.NCM,
            CEST: prod?.CEST,
            CFOP: prod?.CFOP,
            uCom: prod?.uCom,
            qCom: prod?.qCom,
            vUnCom: prod?.vUnCom,
            vProd: prod?.vProd,
            cEANTrib: prod?.cEANTrib,
            uTrib: prod?.uTrib,
            qTrib: prod?.qTrib,
            vUnTrib: prod?.vUnTrib,
            vDesc: prod?.vDesc,
            indTot: prod?.indTot,
        };
    });
}
module.exports = getInformacoesProduto;
