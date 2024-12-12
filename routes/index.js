const express = require('express');
const router = express.Router();
const { db } = require('../config/initDB');

router.get('/', async (req, res) => {
    // Если пользователь не авторизован, показываем приветственную страницу
    if (!req.session.user) {
        return res.render('home', {
            posts: [],
            user: null,
            style: '',
            script: '',
            layout: 'layouts/main'
        });
    }

    try {
        // Получаем все посты только для авторизованных пользователей
        const posts = await db('posts')
            .join('users', 'posts.user_id', 'users.id')
            .select('posts.*', 'users.username')
            .orderBy('posts.created_at', 'asc');

        res.render('home', {
            posts,
            user: req.session.user,
            style: '',
            script: '',
            layout: 'layouts/main'
        });
    } catch (error) {
        console.error('Ошибка загрузки постов:', error);
        res.render('home', {
            posts: [],
            user: req.session.user,
            style: '',
            script: '',
            layout: 'layouts/main'
        });
    }
});

module.exports = router; 