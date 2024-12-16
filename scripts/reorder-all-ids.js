const { pool } = require('../config/database');

async function reorderAllIds() {
    const client = await pool.connect(); // Получаем клиент для работы с транзакциями
    try {
        await client.query('BEGIN'); // Начинаем транзакцию
        console.log('Начинаем пересчет ID');

        // Отключение внешних ключей (только если используется PostgreSQL)
        await client.query('ALTER TABLE posts DISABLE TRIGGER ALL;');
        await client.query('ALTER TABLE comments DISABLE TRIGGER ALL;');
        await client.query('ALTER TABLE users DISABLE TRIGGER ALL;');
        await client.query('ALTER TABLE categories DISABLE TRIGGER ALL;');
        // Убрали строку с user_roles, так как она вызывает ошибку

        // Пересчет ID для таблицы posts
        await client.query(`
            WITH numbered_posts AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM posts
            )
            UPDATE posts
            SET id = numbered_posts.new_id
            FROM numbered_posts
            WHERE posts.id = numbered_posts.id;
        `);
        await client.query(`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts), false);`);
        console.log('ID постов успешно пересчитаны');

        // Пересчет ID для таблицы comments
        await client.query(`
            WITH numbered_comments AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM comments
            )
            UPDATE comments
            SET id = numbered_comments.new_id
            FROM numbered_comments
            WHERE comments.id = numbered_comments.id;
        `);
        await client.query(`SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments), false);`);
        console.log('ID комментариев успешно пересчитаны');

        // Пересчет ID для таблицы users
        await client.query(`
            WITH numbered_users AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM users
            )
            UPDATE users
            SET id = numbered_users.new_id
            FROM numbered_users
            WHERE users.id = numbered_users.id;
        `);
        await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), false);`);
        console.log('ID пользователей успешно пересчитаны');

        // Пересчет ID для таблицы categories (сортировка по id)
        await client.query(`
            WITH numbered_categories AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY id) as new_id
                FROM categories
            )
            UPDATE categories
            SET id = numbered_categories.new_id
            FROM numbered_categories
            WHERE categories.id = numbered_categories.id;
        `);
        await client.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories), false);`);
        console.log('ID категорий успешно пересчитаны');

        // Включение внешних ключей обратно
        await client.query('ALTER TABLE posts ENABLE TRIGGER ALL;');
        await client.query('ALTER TABLE comments ENABLE TRIGGER ALL;');
        await client.query('ALTER TABLE users ENABLE TRIGGER ALL;');
        await client.query('ALTER TABLE categories ENABLE TRIGGER ALL;');
        // Убрали строку с user_roles

        await client.query('COMMIT'); // Подтверждаем транзакцию
        console.log('Все ID успешно пересчитаны');
    } catch (error) {
        await client.query('ROLLBACK'); // Отменяем транзакцию в случае ошибки
        console.error('Ошибка при пересчете ID:', error);
    } finally {
        client.release(); // Освобождаем клиент
    }
}

// Запуск пересчета
reorderAllIds();
