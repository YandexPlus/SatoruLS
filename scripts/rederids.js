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

// Пересчёт ID таблицы
async function reorderIds(tableName, sequenceName, orderByColumn = 'created_at') {
    try {
        console.log(`Начинается пересчёт ID для таблицы "${tableName}"...`);

        // Создание временной таблицы для перенумерации
        await pool.query(`
            CREATE TEMP TABLE ${tableName}_temp AS
            SELECT id, ROW_NUMBER() OVER (ORDER BY ${orderByColumn}) AS new_id
            FROM ${tableName};
        `);

        // Обновление ID в основной таблице
        await pool.query(`
            UPDATE ${tableName}
            SET id = ${tableName}_temp.new_id
            FROM ${tableName}_temp
            WHERE ${tableName}.id = ${tableName}_temp.id;
        `);

        // Сброс последовательности
        await pool.query(`
            SELECT setval('${sequenceName}', (SELECT MAX(id) FROM ${tableName}), true);
        `);

        // Удаление временной таблицы
        await pool.query(`DROP TABLE ${tableName}_temp;`);

        console.log(`Пересчёт ID для таблицы "${tableName}" завершён!`);
    } catch (error) {
        console.error(`Ошибка пересчёта ID для таблицы "${tableName}":`, error);
    }
}

async function reorderAllTables() {
    try {
        await pool.connect();
        console.log('Подключение к базе данных установлено.');

        // Пересчитываем ID для таблиц в правильном порядке
        await reorderIds('posts', 'posts_id_seq');
        await reorderIds('comments', 'comments_id_seq');
        await reorderIds('users', 'users_id_seq');
        await reorderIds('user_roles', 'user_roles_id_seq'); // Если таблица user_roles существует

        console.log('Пересчёт ID для всех таблиц завершён.');
    } catch (error) {
        console.error('Общая ошибка:', error);
    } finally {
        await pool.end();
        console.log('Подключение к базе данных закрыто.');
    }
}

// Запуск пересчёта
reorderAllTables();
