const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../config/initDB');
const pool = require('../config/database').pool;

// Настройка загрузки изображений
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Проверка типа файла
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Middleware для проверки авторизации
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

router.get('/create', isAuthenticated, (req, res) => {
    res.render('posts/create', {
        error: null,
        style: '<link rel="stylesheet" href="/css/posts.css">',
        script: '',
        user: req.session.user
    });
});

router.post('/create', isAuthenticated, upload, async (req, res) => {
    try {
        const { title, content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        
        // Создаем пост через Knex
        const [postId] = await db('posts').insert({
            user_id: req.session.user.id,
            title,
            content,
            image,
            created_at: db.fn.now()
        }).returning('id');

        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        res.render('posts/create', {
            error: 'Ошибка при создании поста',
            style: '<link rel="stylesheet" href="/css/posts.css">',
            script: '',
            layout: 'layouts/main',
            user: req.session.user
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await db('posts')
            .join('users', 'posts.user_id', 'users.id')
            .select('posts.*', 'users.username')
            .where('posts.id', req.params.id)
            .first();
        
        if (!post) {
            return res.status(404).render('error', {
                error: 'Пост не найден',
                style: '',
                script: '',
                layout: 'layouts/main',
                user: req.session.user || null
            });
        }
        
        res.render('posts/show', {
            post,
            style: '',
            script: '',
            layout: 'layouts/main',
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Ошибка загрузки поста:', error);
        res.status(500).render('error', {
            error: 'Ошибка загрузки поста',
            style: '',
            script: '',
            layout: 'layouts/main',
            user: req.session.user || null
        });
    }
});

// Удаление поста
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Проверяем, существует ли пост и принадлежит ли он пользователю
        const post = await db('posts')
            .where({ 
                id: postId,
                user_id: req.session.user.id 
            })
            .first();

        if (!post) {
            return res.status(404).json({ error: 'Пост не найден или у вас нет прав на его удаление' });
        }
        
        // Удаляем пост
        await db('posts').where('id', postId).del();

        // Триггер автоматически пересчитает ID
        await pool.query('SELECT reorder_posts_ids()');

        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        res.status(500).json({ error: 'Ошибка при удалении поста' });
    }
});

module.exports = router; 