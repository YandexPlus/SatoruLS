const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { db } = require('./config/initDB');
const { requireAuth } = require('./middleware/auth');
const { requireAdmin } = require('./middleware/adminAuth');

const app = express();

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Настройка сессий
app.use(session({
    secret: '4PE68-G92GM-2020',
    resave: false,
    saveUninitialized: true
}));

// Middleware для передачи пользователя во все представления
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.style = '';
    res.locals.script = '';
    next();
});

// Роуты
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

// Применяем маршруты
app.use('/auth', authRoutes);

// Защищаем маршруты, требующие авторизации
app.use((req, res, next) => {
    if (req.path.startsWith('/auth')) {
        return next();
    }
    if (!req.session.user && req.path !== '/') {
        return res.redirect('/');
    }
    next();
});

app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);
app.use('/profile', requireAuth);
app.use('/admin', adminRoutes);

// Главная страница
app.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            // Для неавторизованных пользователей показываем только приветствие
            return res.render('home', {
                welcomeOnly: true,
                posts: [],
                style: '',
                script: ''
            });
        }

        // Для авторизованных пользователей показываем посты
        const posts = await db('posts')
            .join('users', 'posts.user_id', 'users.id')
            .select('posts.*', 'users.username')
            .orderBy('posts.created_at', 'asc');

        res.render('home', {
            welcomeOnly: false,
            posts,
            style: '',
            script: ''
        });
    } catch (error) {
        console.error('Ошибка загрузки постов:', error);
        res.status(500).render('error', {
            error: 'Ошибка загрузки постов',
            style: '',
            script: ''
        });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
