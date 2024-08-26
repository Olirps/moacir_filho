// services/userService.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserLogin');


const registerUser = async (username, password,cpfUser) => {
    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Usuário já existe');
        }
        // Criptografa a senha
        const hashedPassword = bcrypt.hashSync(password, 10);
        // Cria o novo usuário
        const user = await User.create({ username, password: hashedPassword,cpfUser });
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const authenticateUser = async (username, password) => {
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !user.validatePassword(password)) {
            throw new Error('Usuário ou senha inválidos');
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { user, token };
    } catch (error) {
        throw new Error(error.message);
    }
};

/*

    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !user.validatePassword(password)) {
            return res.status(400).json({ message: 'Usuário ou senha inválidos' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Autenticado com sucesso', username ,token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar', error: error.message });
    }

*/ 

module.exports = { registerUser, authenticateUser };
