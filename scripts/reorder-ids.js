<<<<<<< HEAD
const { pool } = require('../config/database');

async function reorderPostIds() {
    try {
        // Пересчитываем ID
        await pool.query(`
            WITH RECURSIVE numbered_posts AS (
                SELECT id,
                       ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM posts
            )
            UPDATE posts
            SET id = numbered_posts.new_id
            FROM numbered_posts
            WHERE posts.id = numbered_posts.id;
        `);

        // Сбрасываем последовательность
        await pool.query(`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));`);

        console.log('ID постов успешно пересчитаны');
    } catch (error) {
        console.error('Ошибка при пересчете ID:', error);
    } finally {
        pool.end();
    }
}

=======
const { pool } = require('../config/database');

async function reorderPostIds() {
    try {
        // Пересчитываем ID
        await pool.query(`
            WITH RECURSIVE numbered_posts AS (
                SELECT id,
                       ROW_NUMBER() OVER (ORDER BY created_at) as new_id
                FROM posts
            )
            UPDATE posts
            SET id = numbered_posts.new_id
            FROM numbered_posts
            WHERE posts.id = numbered_posts.id;
        `);

        // Сбрасываем последовательность
        await pool.query(`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));`);

        console.log('ID постов успешно пересчитаны');
    } catch (error) {
        console.error('Ошибка при пересчете ID:', error);
    } finally {
        pool.end();
    }
}

>>>>>>> cb358ef (Initial commit)
reorderPostIds(); 