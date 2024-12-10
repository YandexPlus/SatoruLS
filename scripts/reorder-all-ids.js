const { pool } = require('../config/database');

async function reorderAllIds() {
    try {
        // Пересчет ID для таблицы posts
        await pool.query(`
            WITH RECURSIVE numbered_posts AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
                FROM posts
            )
            UPDATE posts 
            SET id = numbered_posts.new_id 
            FROM numbered_posts 
            WHERE posts.id = numbered_posts.id;
            
            SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
        `);
        console.log('ID постов успешно пересчитаны');

        // Пересчет ID для таблицы comments
        await pool.query(`
            WITH RECURSIVE numbered_comments AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
                FROM comments
            )
            UPDATE comments 
            SET id = numbered_comments.new_id 
            FROM numbered_comments 
            WHERE comments.id = numbered_comments.id;
            
            SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));
        `);
        console.log('ID комментариев успешно пересчитаны');

        // Пересчет ID для таблицы users
        await pool.query(`
            WITH RECURSIVE numbered_users AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
                FROM users
            )
            UPDATE users 
            SET id = numbered_users.new_id 
            FROM numbered_users 
            WHERE users.id = numbered_users.id;
            
            SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
        `);
        console.log('ID пользователей успешно пересчитаны');

        // Пересчет ID для таблицы user_roles (если есть)
        await pool.query(`
            WITH RECURSIVE numbered_roles AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
                FROM user_roles
            )
            UPDATE user_roles 
            SET id = numbered_roles.new_id 
            FROM numbered_roles 
            WHERE user_roles.id = numbered_roles.id;
            
            SELECT setval('user_roles_id_seq', (SELECT MAX(id) FROM user_roles));
        `);
        console.log('ID ролей пользователей успешно пересчитаны');

        console.log('Все ID успешно пересчитаны');
    } catch (error) {
        console.error('Ошибка при пересчете ID:', error);
    } finally {
        await pool.end();
    }
}

// Запускаем пересчет
reorderAllIds(); 