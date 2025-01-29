const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Pega o token do Header

    if (!token) {
        return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Salva os dados do usuário no request
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
};

module.exports = authMiddleware;


/*const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // O token vem no formato "Bearer TOKEN"

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Anexa o usuário ao objeto req para uso futuro
        next(); // Passa para o próximo middleware ou rota
    });
};

module.exports = authenticateToken;
*/