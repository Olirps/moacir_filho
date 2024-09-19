// controllers/userController.js

const { registerUser, authenticateUser } = require('../services/userService');

const register = async (req, res) => {
    const { username, password,cpfUser } = req.body;

    try {
        const user = await registerUser(username, password,cpfUser);
        res.status(201).json({ message: 'Usuário registrado com sucesso', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const { user, token } = await authenticateUser(username, password);
        res.json({ message: 'Autenticado com sucesso', username: user.username, token });
    } catch (error) {
        res.status(400).json({ message: 'Usuário ou senha inválidos', error: error.message });
    }
};



module.exports = { register, login };
