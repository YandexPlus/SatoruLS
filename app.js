const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { db } = require('./config/initDB');
const { requireAuth } = require('./middleware/auth');
const { requireAdmin } = require('./middleware/adminAuth');
const { exec } = require('child_process');

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

// Обслуживание статических файлов из папки scripts
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);
app.use('/profile', requireAuth);
app.use('/admin', adminRoutes);


// Запуск скрипта reorder-all-ids.js
app.post('/admin/run-reorder-script', (req, res) => {
    // Путь к скрипту теперь указывает на папку scripts
    exec('node scripts/reorder-all-ids.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка выполнения скрипта: ${error.message}`);
            return res.status(500).send('Ошибка при выполнении скрипта');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Ошибка при выполнении скрипта');
        }
        console.log(`stdout: ${stdout}`);
        res.send('Скрипт выполнен успешно');
    });
});

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 
