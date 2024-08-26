const path = require('path');
const multer = require('multer');
const NotaFiscalService = require('../services/NotaFiscalService');

const xml2js = require('xml2js');
const fs = require('fs');
const {limpaDocumento} = require("../util/util");


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

class NotaFiscalController {
    static async importarNotaFiscal(req, res) {
        try {
            const files = req.files; // Array de arquivos enviados

            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
            }

            // Cria uma array de promessas para processar cada arquivo
            const processFilePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const parser = new xml2js.Parser();
                    const xmlFilePath = path.join(uploadDir, file.filename);

                    // Lê o conteúdo do arquivo salvo
                    fs.readFile(xmlFilePath, 'utf-8', (err, xmlContent) => {
                        if (err) {
                            console.error('Erro ao ler o arquivo XML:', err);
                            return reject({ error: 'Erro ao ler o arquivo XML' });
                        }

                        parser.parseString(xmlContent.trim(), (err, result) => {
                            if (err) {
                                console.error('Erro ao parsear o XML:', err);
                                return reject({ error: 'Erro ao parsear o XML' });
                            }
                            // Passa o XML parseado para o NotaFiscalService
                            const notaFiscal = NotaFiscalService.criarNotaFiscal(result);
                            resolve(notaFiscal);
                        });
                    });
                });
            });

            // Espera que todos os arquivos sejam processados
            const notasFiscais = await Promise.all(processFilePromises);

            // Responde com sucesso
            res.status(201).json({ message: 'Notas fiscais criadas com sucesso', notasFiscais });

        } catch (err) {
            res.status(400).json({ error: err.message });

            /*console.error('Erro ao importar nota fiscal:', error);
            // Verifica se a resposta já foi enviada
            if (!res.headersSent) {
                res.status(500).json({ error: 'Ocorreu um erro ao importar a nota fiscal' });
            }*/
        }
    }

    static async criarNotaFiscal(req, res) {
        try {

            console.log('Chamou para Criar');

            const notafiscalcriacao = limpaDocumento(req.body);

            console.log('Chamou para Criar'+JSON.stringify(notafiscalcriacao));


            // Passar os dados para o serviço
            const notafiscal = await NotaFiscalService.criarNotaFiscalManual(notafiscalcriacao);

            // Retornar a resposta com o status 201 (Criado)
            res.status(201).json(notafiscal);
        } catch (err) {
            // Retornar erro com status 400 (Solicitação Incorreta)
            res.status(400).json({ error: err.message });
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

module.exports = { NotaFiscalController, upload, handleMulterErrors };
