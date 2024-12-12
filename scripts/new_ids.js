const { pool } = require('../config/database');

async function reorderAllIds() {
    try {
        // Таблицы для пересчета ID
        const tables = [
            { name: 'posts', seqName: 'posts_id_seq', columns: ['id', 'user_id', 'title', 'content', 'image', 'likes'], orderBy: 'created_at' },
            { name: 'comments', seqName: 'comments_id_seq', columns: ['id', 'post_id', 'user_id', 'content', 'created_at'], orderBy: 'created_at' },
            { name: 'users', seqName: 'users_id_seq', columns: ['id', 'username', 'email', 'created_at'], orderBy: 'created_at' },
            { name: 'user_roles', seqName: 'user_roles_id_seq', columns: ['id', 'role_name'], orderBy: 'id' } // Без сортировки по дате
        ];

        for (const table of tables) {
            console.log(`Начат пересчет ID для таблицы ${table.name}...`);

            // Создаём временную таблицу
            const tempTableName = `${table.name}_temp`;
            const columnList = table.columns.join(', ');
            await pool.query(`
                CREATE TEMP TABLE ${tempTableName} AS
                SELECT ROW_NUMBER() OVER (ORDER BY ${table.orderBy}) AS id, ${columnList.replace('id, ', '')}
                FROM ${table.name};
            `);

            console.log(`Временная таблица ${tempTableName} создана`);

            // Очищаем оригинальную таблицу
            await pool.query(`TRUNCATE TABLE ${table.name} RESTART IDENTITY;`);
            console.log(`Таблица ${table.name} очищена`);

            // Вставляем данные обратно
            await pool.query(`
                INSERT INTO ${table.name} (${columnList})
                SELECT ${columnList} FROM ${tempTableName};
            `);

            console.log(`Данные из ${tempTableName} перенесены в ${table.name}`);

            // Сбрасываем последовательность
            await pool.query(`
                SELECT setval('${table.seqName}', (SELECT MAX(id) FROM ${table.name}));
            `);

            console.log(`Последовательность ${table.seqName} обновлена`);
        }

        console.log('Пересчет ID для всех таблиц завершен');
    } catch (error) {
        console.error('Ошибка при пересчете ID:', error);
    } finally {
        await pool.end();
    }
}

// Запуск функции
reorderAllIds();
