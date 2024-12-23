const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../config/initDB');
const pool = require('../config/database').pool;

// Настройка загрузки изображений
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
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

// Получение категорий для выбора при создании поста
router.get('/create', isAuthenticated, async (req, res) => {
    try {
        // Получаем все категории из базы данных
        const categories = await db('categories').select('id', 'name');

        res.render('posts/create', {
            error: null,
            style: '<link rel="stylesheet" href="/css/posts.css">',
            script: '',
            user: req.session.user,
            categories // Передаем категории в шаблон
        });
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        res.render('posts/create', {
            error: 'Не удалось загрузить категории',
            style: '<link rel="stylesheet" href="/css/posts.css">',
            script: '',
            user: req.session.user,
            categories: [] // Если ошибка, категории могут быть пустыми
        });
    }
});

router.post('/create', isAuthenticated, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.render('posts/create', {
                error: 'Ошибка при загрузке изображения: ' + err.message,
                style: '<link rel="stylesheet" href="/css/posts.css">',
                script: '',
                user: req.session.user,
                categories: [] // Передаем категории, если есть ошибка
            });
        }

        try {
            const { title, content, category_id, imageUrls } = req.body;

            // Проверка на тип imageUrls
            let imageUrlsArray = [];
            if (imageUrls) {
                if (Array.isArray(imageUrls)) {
                    // Если imageUrls уже массив (например, если форма отправила несколько полей с одинаковым именем)
                    imageUrlsArray = imageUrls;
                } else if (typeof imageUrls === 'string') {
                    // Если imageUrls это строка (например, запятая разделяет URL)
                    imageUrlsArray = imageUrls.split(',').map(url => url.trim());
                }
            }

            // Если категории нет, устанавливаем null
            const categoryId = category_id || null;

            // Если imageUrlsArray пустой, передаем NULL
            const images = imageUrlsArray.length > 0 ? imageUrlsArray : null;

            // Создаем пост в базе данных
            const [postId] = await db('posts').insert({
                user_id: req.session.user.id,
                title,
                content,
                images, // Массив URL изображений или NULL
                category_id: categoryId,
                created_at: db.fn.now()
            }).returning('id');

            res.redirect('/'); // Перенаправление на главную страницу

        } catch (error) {
            console.error('Ошибка при создании поста:', error);
            res.render('posts/create', {
                error: 'Не удалось создать пост. Попробуйте позже.',
                style: '<link rel="stylesheet" href="/css/posts.css">',
                script: '',
                user: req.session.user,
                categories: [] // Если ошибка, категории могут быть пустыми
            });
        }
    });
});

// Просмотр поста
router.get('/:id', async (req, res) => {
    try {
        const post = await db('posts')
            .join('users', 'posts.user_id', 'users.id')
            .leftJoin('categories', 'posts.category_id', 'categories.id') // Присоединяем категорию
            .select('posts.*', 'users.username', 'categories.name as category_name') // Получаем категорию
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
