const { Pool } = require('pg');

// Настройка подключения
const pool = new Pool({
    user: 'postgres',
    host: '176.108.252.232',
    database: 'satorubase',
    password: 'satoruls',
    port: 5432,
    ssl: false, // SSL отключён
});

// Функция для удаления таблицы
async function dropPostsTable() {
    try {
        await pool.connect();
        console.log('Подключение к базе данных установлено.');

        // Удаление таблицы
        console.log('Удаление таблицы "posts"...');
        await pool.query('DROP TABLE IF EXISTS posts CASCADE;');

        console.log('Таблица "posts" успешно удалена.');
    } catch (error) {
        console.error('Ошибка при удалении таблицы "posts":', error);
    } finally {
        await pool.end();
        console.log('Подключение к базе данных закрыто.');
    }
}

// Запуск удаления таблицы
dropPostsTable();
