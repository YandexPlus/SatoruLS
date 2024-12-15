const express = require('express');
const router = express.Router();
const { db } = require('../config/initDB');

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Получение комментариев для поста
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await db('comments')
            .join('users', 'comments.user_id', 'users.id')
            .where('post_id', req.params.postId)
            .select('comments.*', 'users.username')
            .orderBy('comments.created_at', 'desc');

        res.json(comments);
    } catch (error) {
        console.error('Ошибка при получении комментариев:', error);
        res.status(500).json({ error: 'Ошибка при получении комментариев' });
    }
});

// Добавление комментария
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { post_id, content } = req.body;
        
        // Проверяем наличие необходимых данных
        if (!post_id || !content) {
            return res.status(400).json({ error: 'Необходимо выбрать пост и написать комментарий' });
        }

        // Создаем комментарий
        await db('comments').insert({
            user_id: req.session.user.id,
            post_id,
            content,
            created_at: db.fn.now()
        });

        // Перенаправляем обратно на страницу комментариев
        res.redirect('/comments');
    } catch (error) {
        console.error('Ошибка при создании комментария:', error);
        res.status(500).render('error', {
            error: 'Ошибка при создании комментария',
            style: '',
            script: ''
        });
    }
});

// Удаление комментария
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const comment = await db('comments')
            .where({
                id: req.params.id,
                user_id: req.session.user.id
            })
            .first();

        if (!comment) {
            return res.status(404).json({ error: 'Комментарий не найден или у вас нет прав на его удаление' });
        }

        await db('comments').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        res.status(500).json({ error: 'Ошибка при удалении комментария' });
    }
});

// Обновим маршрут для главной страницы комментариев
router.get('/', async (req, res) => {
    try {
        // Получаем комментарии
        const comments = await db('comments')
            .join('users', 'comments.user_id', 'users.id')
            .join('posts', 'comments.post_id', 'posts.id')
            .select(
                'comments.*',
                'users.username',
                'posts.title as post_title'
            )
            .orderBy('comments.created_at', 'desc');

        // Получаем список постов для выпадающего списка
        const posts = await db('posts')
            .select('id', 'title')
            .orderBy('created_at', 'asc');

        res.render('comments/index', {
            comments: comments || [],
            posts,
            style: '<link rel="stylesheet" href="/css/comments.css">',
            script: ''
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).render('error', {
            error: 'Ошибка при получении данных',
            style: '',
            script: ''
        });
    }
});

module.exports = router; 
