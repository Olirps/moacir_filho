const path = require('path');
const multer = require('multer');
const NotaFiscalService = require('../services/NotaFiscalService');

const xml2js = require('xml2js');
const fs = require('fs');
const { limpaDocumento } = require("../util/util");
const NotaFiscal = require("../models/NotaFiscal");
const Fornecedores = require("../models/Fornecedores");


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

            for (let i = 0; i < files.length; i++) {
                const filePath = files[i].path;
                if (typeof filePath === 'string') {
                    try {
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
                            return res.status(400).json({
                                error: 'Foi enviado um arquivo que não é Nota Fiscal. Por favor, verifique!'
                            });
                        }
                        // Aguardando a verificação de cada nota antes de continuar
                        const existeNf = await existeNF(identNF, identForn);
                        if (existeNf) {
                            console.log('Nota fiscal já cadastrada, abortando importação.');
                            return res.status(400).json({
                                error: `Nota Fiscal ${identNF} do Fornecedor ${identForn} já cadastrada. Importação abortada.`
                            });
                        }
                    } catch (error) {
                        console.error('Erro ao processar o arquivo:', error);
                        return res.status(500).json({ error: 'Erro ao processar o arquivo XML' });
                    }
                } else {
                    console.error('O caminho do arquivo não é uma string:', filePath);
                }
            }

            // Se chegou aqui, significa que nenhuma nota estava cadastrada previamente
            // Continua com o processamento das notas

            const processFilePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const parser = new xml2js.Parser();
                    const xmlFilePath = path.join(uploadDir, file.filename);

                    fs.readFile(xmlFilePath, 'utf-8', (err, xmlContent) => {
                        if (err) {
                            console.error('Erro ao ler o arquivo XML:', err);
                            return reject({ error: 'Erro ao ler o arquivo XML' });
                        }

                        parser.parseString(xmlContent.trim(), async (err, result) => {
                            if (err) {
                                console.error('Erro ao parsear o XML:', err);
                                return reject({ error: 'Erro ao parsear o XML' });
                            }

                            const notaFiscal = await NotaFiscalService.criarNotaFiscal(result, files.length);
                            resolve(notaFiscal);
                        });
                    });
                });
            });

            const notasFiscais = await Promise.all(processFilePromises);

            res.status(201).json({ message: 'Notas fiscais criadas com sucesso', notasFiscais });

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
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
}

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
