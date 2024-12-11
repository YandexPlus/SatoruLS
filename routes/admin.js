<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { db } = require('../config/initDB');

// Middleware для проверки прав админа
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};

// Главная страница админ-панели
router.get('/', isAdmin, async (req, res) => {
    try {
        // Получаем статистику
        const usersCount = await db('users').count('id as count').first();
        const postsCount = await db('posts').count('id as count').first();
        const commentsCount = await db('comments').count('id as count').first();

        // Получаем списки для управления
        const users = await db('users')
            .select('*')
            .orderBy('created_at', 'desc');

        const posts = await db('posts')
            .join('users', 'posts.user_id', 'users.id')
            .select('posts.*', 'users.username')
            .orderBy('posts.created_at', 'desc');

        const comments = await db('comments')
            .join('users', 'comments.user_id', 'users.id')
            .join('posts', 'comments.post_id', 'posts.id')
            .select('comments.*', 'users.username', 'posts.title as post_title')
            .orderBy('comments.created_at', 'desc');

        res.render('admin/dashboard', {
            stats: {
                users: usersCount.count,
                posts: postsCount.count,
                comments: commentsCount.count
            },
            users,
            posts,
            comments,
            style: '<link rel="stylesheet" href="/css/admin.css">',
            script: '',
            layout: 'layouts/main'
        });
    } catch (error) {
        console.error('Ошибка загрузки данных админ-панели:', error);
        res.status(500).render('error', { 
            error: 'Ошибка загрузки данных админ-панели',
            style: '',
            script: '',
            layout: 'layouts/main'
        });
    }
});

// Удаление пользователя
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await db('users').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
});

// Удаление поста
router.delete('/posts/:id', isAdmin, async (req, res) => {
    try {
        await db('posts').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении поста' });
    }
});

// Удаление комментария
router.delete('/comments/:id', isAdmin, async (req, res) => {
    try {
        await db('comments').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении комментария' });
    }
});

module.exports = router; 
=======
const express = require('express');
const router = express.Router();
const { db } = require('../config/initDB');

// Middleware для проверки прав админа
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};

// Главная страница админ-панели
router.get('/', isAdmin, async (req, res) => {
    try {
        // Получаем статистику
        const usersCount = await db('users').count('id as count').first();
        const postsCount = await db('posts').count('id as count').first();
        const commentsCount = await db('comments').count('id as count').first();

        // Получаем списки для управления с сортировкой по возрастанию
        const users = await db('users')
            .select('*')
            .orderBy('id', 'asc');  // Сортировка пользователей по ID по возрастанию

        const posts = await db('posts')
            .join('users', 'posts.user_id', 'users.id')
            .select('posts.*', 'users.username')
            .orderBy('posts.id', 'asc');  // Сортировка постов по ID по возрастанию

        const comments = await db('comments')
            .join('users', 'comments.user_id', 'users.id')
            .join('posts', 'comments.post_id', 'posts.id')
            .select('comments.*', 'users.username', 'posts.title as post_title')
            .orderBy('comments.id', 'asc');  // Сортировка комментариев по ID по возрастанию

        res.render('admin/dashboard', {
            stats: {
                users: usersCount.count,
                posts: postsCount.count,
                comments: commentsCount.count
            },
            users,
            posts,
            comments,
            style: '<link rel="stylesheet" href="/css/admin.css">',
            script: '',
            layout: 'layouts/main'
        });
    } catch (error) {
        console.error('Ошибка загрузки данных админ-панели:', error);
        res.status(500).render('error', { 
            error: 'Ошибка загрузки данных админ-панели',
            style: '',
            script: '',
            layout: 'layouts/main'
        });
    }
});

// Удаление пользователя
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await db('users').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
});

// Удаление поста
router.delete('/posts/:id', isAdmin, async (req, res) => {
    try {
        await db('posts').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении поста' });
    }
});

// Удаление комментария
router.delete('/comments/:id', isAdmin, async (req, res) => {
    try {
        await db('comments').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении комментария' });
    }
});

module.exports = router;
>>>>>>> cb358ef (Initial commit)
