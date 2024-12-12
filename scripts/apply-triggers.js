const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function applyTriggers() {
    const client = await pool.connect();
    try {
        // Начинаем транзакцию
        await client.query('BEGIN');

        const sqlFile = path.join(__dirname, '../migrations/create_reorder_triggers.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        // Выполняем SQL в рамках транзакции
        await client.query(sql);
        
        // Подтверждаем транзакцию
        await client.query('COMMIT');
        console.log('Триггеры успешно созданы');
    } catch (error) {
        // Откатываем транзакцию в случае ошибки
        await client.query('ROLLBACK');
        console.error('Ошибка при создании триггеров:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

applyTriggers(); 