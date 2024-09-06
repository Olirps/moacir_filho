const path = require('path');
const multer = require('multer');
const NotaFiscalService = require('../services/NotaFiscalService');

const xml2js = require('xml2js');
const fs = require('fs');
const { limpaDocumento } = require("../util/util");
const NotaFiscal = require("../models/NotaFiscal");
const Fornecedores = require("../models/Fornecedores");
let filaDeArquivos = [];
let processando = false; // Flag para verificar se já está processando


// Cria a pasta /uploads se ela não existir
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração para armazenar arquivos na pasta /uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Define o diretório de destino para os uploads
    },
    filename: function (req, file, cb) {
        const sanitizedFilename = sanitizeFilename(file.originalname);
        cb(null, `${Date.now()}-${sanitizedFilename}`); // Define o nome do arquivo (sanitizado e com timestamp)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (fileExtension !== '.xml') {
            const error = new Error('Apenas arquivos XML são permitidos');
            error.status = 400; // Define o status HTTP como 400
            return cb(error, false);
        }

        cb(null, true);
    }
});

const options = {
    explicitArray: false, // Remove arrays quando não necessário
    ignoreAttrs: false,   // Mantém os atributos dos nós
    mergeAttrs: true      // Junta os atributos com o objeto pai
};

class NotaFiscalController {
    static async importarNotaFiscal(req, res) {
        try {
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
            }

            // Adiciona os arquivos na fila
            files.forEach(file => {
                filaDeArquivos.push(file);
            });

            // Inicia o processamento da fila, se já não estiver processando
            if (!processando) {
                await NotaFiscalController.processarFila(res); // Referenciando o método estaticamente
            } else {
                res.status(202).json({ message: 'Arquivos adicionados à fila para processamento' });
            }

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async processarFila(res) {
        processando = true; // Indica que o processamento está em andamento
        let resultados = [];

        while (filaDeArquivos.length > 0) {
            const file = filaDeArquivos.shift(); // Remove o primeiro arquivo da fila
            try {
                await processarArquivo(file);
                resultados.push({ arquivo: file.originalname, status: "sucesso" });
            } catch (error) {
                console.error('Erro ao processar o arquivo:', error);
                resultados.push({ arquivo: file.originalname, status: "erro", mensagem: error.message });
            }
        }

        // Após processar todos os arquivos, envia a resposta com os resultados
        if (!res.headersSent) {
            res.status(200).json({ message: 'Processamento concluído', resultados });
        }

        processando = false; // Reseta a flag de processamento
    }
    static async criarNotaFiscal(req, res) {
        try {
            const notafiscalcriacao = limpaDocumento(req.body);
            // Passar os dados para o serviço
            const notafiscal = await NotaFiscalService.criarNotaFiscalManual(notafiscalcriacao);

            // Retornar a resposta com o status 201 (Criado)
            res.status(201).json(notafiscal);
        } catch (err) {
            // Retornar erro com status 400 (Solicitação Incorreta)
            res.status(400).json({ error: err.message });
        }
    }

    // Método GET para listar todas as notas fiscais
    static async listarNotaFiscal(req, res) {
        try {
            const notasFiscais = await NotaFiscalService.getAllNotasFiscais();
            res.status(200).json(notasFiscais);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Método GET para buscar uma nota fiscal por ID
    static async obterNotaFiscalPorId(req, res) {
        try {
            const { id } = req.params;
            const notaFiscal = await NotaFiscalService.getNotaFiscalById(id);

            if (!notaFiscal) {
                return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
            }

            res.status(200).json(notaFiscal);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // Método PUT para atualizar uma nota fiscal existente
    static async atualizarNotaFiscal(req, res) {
        try {
            const { id } = req.params;
            const notaFiscalData = limpaDocumento(req.body);
            const notaFiscalAtualizada = await NotaFiscalService.updateNotaFiscal(id, notaFiscalData);

            if (!notaFiscalAtualizada) {
                return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
            }

            res.status(200).json(notaFiscalAtualizada);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Método DELETE para remover uma nota fiscal por ID
    static async excluirNotaFiscal(req, res) {
        try {
            const { id } = req.params;
            const notaFiscal = await NotaFiscalService.getNotaFiscalById(id);

            if (!notaFiscal) {
                return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
            }

            await NotaFiscalService.deleteNotaFiscal(id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    /// ------ NOVAS FUNÇÕES -------///////


    // Função para processar a fila
    /*static async processarFila(res) {
        processando = true; // Indica que o processamento está em andamento
        let resultados = [];

        while (filaDeArquivos.length > 0) {
            const file = filaDeArquivos.shift(); // Remove o primeiro arquivo da fila
            try {
                await processarArquivo(file);
                resultados.push({ arquivo: file.originalname, status: "sucesso" });
            } catch (error) {
                console.error('Erro ao processar o arquivo:', error);
                resultados.push({ arquivo: file.originalname, status: "erro", mensagem: error.message });
            }
        }

        // Após processar todos os arquivos, envia a resposta com os resultados
        if (!res.headersSent) {
            res.status(200).json({ message: 'Processamento concluído', resultados });
        }

        processando = false; // Reseta a flag de processamento
    }*/
}

async function processarArquivo(file) {
    const filePath = file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parser = new xml2js.Parser(options);

    const result = await new Promise((resolve, reject) => {
        parser.parseString(fileContent, (err, parsedResult) => {
            if (err) {
                return reject(err);
            }
            resolve(parsedResult);
        });
    });

    const data = JSON.parse(JSON.stringify(result));
    const identNF = data.nfeProc?.NFe?.infNFe?.ide?.nNF;
    const identForn = data.nfeProc?.NFe?.infNFe?.emit?.CNPJ;

    if (data.nfeProc == undefined) {
        throw new Error('Foi enviado um arquivo que não é Nota Fiscal. Por favor, verifique!');
    }

    // Verificação de duplicidade
    const existeNf = await existeNF(identNF, identForn);
    if (existeNf) {
        throw new Error(`Nota Fiscal ${identNF} do Fornecedor ${identForn} já cadastrada.`);
    }

    // Processa a nota fiscal
    await NotaFiscalService.criarNotaFiscal(result, file.length);
}



/// ------ NOVAS FUNÇÕES -------///////



// Middleware para lidar com erros do multer
function handleMulterErrors(err, req, res, next) {
    if (err instanceof multer.MulterError || err.message === 'Apenas arquivos XML são permitidos') {
        return res.status(err.status || 400).json({ error: err.message });
    }
    next(err);
}

// Função para sanitizar o nome do arquivo
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_\-\.]/g, '');
}

async function existeNF(nroNf, ident) {
    const fornecedoresExistente = await Fornecedores.findOne({
        where: { cpfCnpj: ident }
    });
    if (!fornecedoresExistente) {
        return false;
    } else {
        const exist = await NotaFiscal.findOne({ where: { nNF: nroNf, codFornecedor: fornecedoresExistente.id } });
        return !!exist;
    }

}

module.exports = { NotaFiscalController, upload, handleMulterErrors };