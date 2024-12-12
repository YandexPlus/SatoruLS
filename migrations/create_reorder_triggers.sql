-- Функция для пересчета ID постов
CREATE OR REPLACE FUNCTION reorder_posts_ids() 
RETURNS TRIGGER AS $$
BEGIN
    -- Блокируем таблицу для предотвращения конкурентных обновлений
    LOCK TABLE posts IN EXCLUSIVE MODE;
    
    WITH RECURSIVE numbered_posts AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
        FROM posts
    )
    UPDATE posts 
    SET id = numbered_posts.new_id 
    FROM numbered_posts 
    WHERE posts.id = numbered_posts.id;
    
    PERFORM setval('posts_id_seq', COALESCE((SELECT MAX(id) FROM posts), 1));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Функция для пересчета ID комментариев
CREATE OR REPLACE FUNCTION reorder_comments_ids() 
RETURNS TRIGGER AS $$
BEGIN
    -- Блокируем таблицу для предотвращения конкурентных обновлений
    LOCK TABLE comments IN EXCLUSIVE MODE;
    
    WITH RECURSIVE numbered_comments AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
        FROM comments
    )
    UPDATE comments 
    SET id = numbered_comments.new_id 
    FROM numbered_comments 
    WHERE comments.id = numbered_comments.id;
    
    PERFORM setval('comments_id_seq', COALESCE((SELECT MAX(id) FROM comments), 1));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Функция для пересчета ID пользователей
CREATE OR REPLACE FUNCTION reorder_users_ids() 
RETURNS TRIGGER AS $$
BEGIN
    -- Блокируем таблицу для предотвращения конкурентных обновлений
    LOCK TABLE users IN EXCLUSIVE MODE;
    
    WITH RECURSIVE numbered_users AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
        FROM users
    )
    UPDATE users 
    SET id = numbered_users.new_id 
    FROM numbered_users 
    WHERE users.id = numbered_users.id;
    
    PERFORM setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Удаляем существующие триггеры, если они есть
DROP TRIGGER IF EXISTS reorder_posts_trigger ON posts;
DROP TRIGGER IF EXISTS reorder_comments_trigger ON comments;
DROP TRIGGER IF EXISTS reorder_users_trigger ON users;

-- Создаем новые триггеры
CREATE TRIGGER reorder_posts_trigger
    AFTER DELETE ON posts
    FOR EACH STATEMENT
    EXECUTE FUNCTION reorder_posts_ids();

CREATE TRIGGER reorder_comments_trigger
    AFTER DELETE ON comments
    FOR EACH STATEMENT
    EXECUTE FUNCTION reorder_comments_ids();

CREATE TRIGGER reorder_users_trigger
    AFTER DELETE ON users
    FOR EACH STATEMENT
    EXECUTE FUNCTION reorder_users_ids(); 