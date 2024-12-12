-- Функция для пересчета ID
CREATE OR REPLACE FUNCTION reorder_posts_ids() 
RETURNS TRIGGER AS $$
BEGIN
    -- Пересчитываем ID только если есть пропуски
    IF EXISTS (
        SELECT 1 FROM posts p1
        LEFT JOIN posts p2 ON p1.id = p2.id - 1
        WHERE p2.id IS NULL AND p1.id < (SELECT MAX(id) FROM posts)
    ) THEN
        -- Пересчитываем ID
        WITH cte AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_id 
            FROM posts
        )
        UPDATE posts 
        SET id = cte.new_id 
        FROM cte 
        WHERE posts.id = cte.id;
        
        -- Обновляем последовательность
        PERFORM setval('posts_id_seq', (SELECT MAX(id) FROM posts));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер, который будет вызывать функцию после удаления
DROP TRIGGER IF EXISTS reorder_posts_trigger ON posts;
CREATE TRIGGER reorder_posts_trigger
AFTER DELETE ON posts
FOR EACH STATEMENT
EXECUTE FUNCTION reorder_posts_ids(); 