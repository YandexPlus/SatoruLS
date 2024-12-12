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

// Функция для создания таблицы
async function createPostsTable() {
    try {
        await pool.connect();
        console.log('Подключение к базе данных установлено.');

        // Создание таблицы
        console.log('Создание таблицы "posts"...');
        await pool.query(`
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY, -- Автоинкремент
                user_id INT,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(255),
                likes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            
            -- Сброс последовательности автоинкремента, чтобы id начинался с 1
            ALTER SEQUENCE posts_id_seq RESTART WITH 1;
        `);

        console.log('Таблица "posts" успешно создана с автоматическим пересчётом ID, начиная с 1.');
    } catch (error) {
        console.error('Ошибка при создании таблицы "posts":', error);
    } finally {
        await pool.end();
        console.log('Подключение к базе данных закрыто.');
    }
}

// Запуск создания таблицы
createPostsTable();
