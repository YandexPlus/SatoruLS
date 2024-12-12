const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Настройка подключения
const pool = new Pool({
    user: 'postgres',
    host: '176.108.252.232',
    database: 'satorubase',
    password: 'satoruls',
    port: 5432,
    ssl: false, // SSL отключён
});

// Функция для записи в JSON с форматированием
async function savePostsToJSON() {
    try {
        const client = await pool.connect();
        console.log('Подключение к базе данных установлено.');

        // Получение всех данных из таблицы
        const res = await client.query('SELECT * FROM posts');
        const posts = res.rows;

        // Создание папки 'data' в корне проекта, если она не существует
        const folderPath = path.join(__dirname, '..', 'data');  // Изменение на корень проекта
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);  // Создаём папку
        }

        // Путь к файлу в папке 'data' в корне проекта
        const filePath = path.join(folderPath, 'posts.json');

        // Запись в JSON файл с отступами для читаемости
        fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));  // Запись с отступами для читаемости

        console.log('Данные сохранены в файл "posts.json" в папке "data".');
    } catch (error) {
        console.error('Ошибка при сохранении данных в JSON:', error);
    } finally {
        await pool.end();
        console.log('Подключение к базе данных закрыто.');
    }
}

// Запуск функции
savePostsToJSON();
