const { pool } = require('../config/database');

async function reorderAllIds() {
    try {
        console.log('Начинаем пересчет ID');

        // Отключение внешних ключей (только если используется PostgreSQL)
        await pool.query('ALTER TABLE posts DISABLE TRIGGER ALL;');
        await pool.query('ALTER TABLE comments DISABLE TRIGGER ALL;');
        await pool.query('ALTER TABLE users DISABLE TRIGGER ALL;');
        await pool.query('ALTER TABLE user_roles DISABLE TRIGGER ALL;');

        // Пересчет ID для таблицы posts
        await pool.query(`
            WITH numbered_posts AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM posts
            )
            UPDATE posts
            SET id = numbered_posts.new_id
            FROM numbered_posts
            WHERE posts.id = numbered_posts.id;
        `);
        await pool.query(`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));`);
        console.log('ID постов успешно пересчитаны');

        // Пересчет ID для таблицы comments
        await pool.query(`
            WITH numbered_comments AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM comments
            )
            UPDATE comments
            SET id = numbered_comments.new_id
            FROM numbered_comments
            WHERE comments.id = numbered_comments.id;
        `);
        await pool.query(`SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));`);
        console.log('ID комментариев успешно пересчитаны');

        // Пересчет ID для таблицы users
        await pool.query(`
            WITH numbered_users AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM users
            )
            UPDATE users
            SET id = numbered_users.new_id
            FROM numbered_users
            WHERE users.id = numbered_users.id;
        `);
        await pool.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`);
        console.log('ID пользователей успешно пересчитаны');

        // Пересчет ID для таблицы user_roles
        await pool.query(`
            WITH numbered_roles AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM user_roles
            )
            UPDATE user_roles
            SET id = numbered_roles.new_id
            FROM numbered_roles
            WHERE user_roles.id = numbered_roles.id;
        `);
        await pool.query(`SELECT setval('user_roles_id_seq', (SELECT MAX(id) FROM user_roles));`);
        console.log('ID ролей пользователей успешно пересчитаны');

        // Включение внешних ключей обратно
        await pool.query('ALTER TABLE posts ENABLE TRIGGER ALL;');
        await pool.query('ALTER TABLE comments ENABLE TRIGGER ALL;');
        await pool.query('ALTER TABLE users ENABLE TRIGGER ALL;');
        await pool.query('ALTER TABLE user_roles ENABLE TRIGGER ALL;');

        console.log('Все ID успешно пересчитаны');
    } catch (error) {
        console.error('Ошибка при пересчете ID:', error);
    } finally {
        await pool.end();
    }
}

// Запуск пересчета
reorderAllIds();
