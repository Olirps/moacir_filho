// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserLogin'); // Ajuste o caminho se necessário

const router = express.Router();

// Rota de Registro de Usuário
/*router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        res.status(201).json({ message: 'Usuário registrado com sucesso', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
});*/

// Rota de Login de Usuário
/*router.post('/login', async (req, res) => {
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
});*/

module.exports = router;
