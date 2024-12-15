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

async function createView() {
    const createViewQuery = `
        CREATE OR REPLACE VIEW sorted_posts AS
        SELECT * 
        FROM posts
        ORDER BY id ASC;
    `;

    try {
        const client = await pool.connect();
        console.log('Подключение к базе данных установлено.');

        await client.query(createViewQuery);
        console.log('Представление sorted_posts успешно создано.');

        client.release();
    } catch (error) {
        console.error('Ошибка при создании представления:', error);
    } finally {
        await pool.end();
        console.log('Подключение к базе данных закрыто.');
    }
}

// Запуск функции
createView();
