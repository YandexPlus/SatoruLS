const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: 'postgres',
    host: '176.108.252.232',
    database: 'satorubase',
    password: 'satoruls',
    port: 5432,
    ssl: false
});

// Функция для применения миграций
async function applyMigrations() {
    try {
        // Читаем файл миграции
        const migrationPath = path.join(__dirname, '../migrations/reorder_posts_function.sql');
        const migration = fs.readFileSync(migrationPath, 'utf8');

        // Применяем миграцию
        await pool.query(migration);
        console.log('Миграция успешно применена: функция пересчета ID создана');
    } catch (error) {
        console.error('Ошибка при применении миграции:', error);
    }
}

// Применяем миграции при запуске приложения
applyMigrations();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 