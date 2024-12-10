const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { db } = require('../config/initDB');

// Главная страница авторизации
router.get('/', (req, res) => {
    // Перенаправляем на страницу входа
    res.redirect('/auth/login');
});

// Страница входа
router.get('/login', (req, res) => {
    // Если пользователь уже авторизован, перенаправляем на главную
    if (req.session.user) {
        return res.redirect('/');
    }

    res.render('auth/login', { 
        error: null,
        style: '',
        script: '',
        layout: 'layouts/main'
    });
});

// Обработка входа
router.post('/login', async (req, res) => {
    try {
        const { email, username, password, loginType } = req.body;
        
        // Ищем пользователя по email или username в зависимости от типа входа
        const user = await db('users')
            .where(loginType === 'email' ? { email } : { username })
            .first();

        if (!user) {
            return res.render('auth/login', {
                error: 'Пользователь не найден',
                style: '<link rel="stylesheet" href="/css/auth.css">',
                script: ''
            });
        }

        // Проверяем пароль
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('auth/login', {
                error: 'Неверный пароль',
                style: '<link rel="stylesheet" href="/css/auth.css">',
                script: ''
            });
        }

        // Создаем сессию
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.render('auth/login', {
            error: 'Ошибка при входе',
            style: '<link rel="stylesheet" href="/css/auth.css">',
            script: ''
        });
    }
});

// Страница регистрации
router.get('/register', (req, res) => {
    res.render('auth/register', { 
        error: null,
        style: '',
        script: '',
        user: req.session.user || null
    });
});

// Обработка регистрации
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Проверяем, существует ли пользователь
        const existingUser = await db('users')
            .where('email', email)
            .orWhere('username', username)
            .first();

        if (existingUser) {
            return res.render('auth/register', { 
                error: 'Пользователь с таким email или именем уже существует',
                style: '',
                script: '',
                layout: 'layouts/main',
                user: null
            });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const [userId] = await db('users').insert({
            username,
            email,
            password: hashedPassword,
            role: 'user',
            created_at: db.fn.now()
        }).returning('id');

        // Создаем сессию
        req.session.user = {
            id: userId,
            username,
            email,
            role: 'user'
        };

        // Перенаправляем на главную страницу после успешной регистрации
        res.redirect('/');

    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.render('auth/register', { 
            error: 'Произошла ошибка при регистрации',
            style: '',
            script: '',
            layout: 'layouts/main',
            user: null
        });
    }
});

// Выход
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 