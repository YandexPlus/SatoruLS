const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Главная страница профиля
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Получаем информацию о пользователе
        const [user] = await connection.promise().query(
            'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
            [req.session.user.id]
        );

        // Получаем посты пользователя
        const [posts] = await connection.promise().query(
            'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );

        res.render('profile/index', {
            user: req.session.user,
            userDetails: user[0],
            posts: posts,
            style: '',
            script: '',
            layout: 'layouts/main'
        });
    } catch (error) {
        res.status(500).render('error', {
            error: 'Ошибка загрузки профиля',
            style: '',
            script: '',
            layout: 'layouts/main',
            user: req.session.user
        });
    }
});

module.exports = router; 