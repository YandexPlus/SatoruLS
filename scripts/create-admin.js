<<<<<<< HEAD
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const client = await pool.connect();
    try {
        // Начинаем транзакцию
        await client.query('BEGIN');

        // Проверяем, существует ли уже админ
        const adminExists = await client.query(
            "SELECT * FROM users WHERE username = 'admin'"
        );

        if (adminExists.rows.length > 0) {
            console.log('Админ уже существует');
            return;
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash('admin', 10);

        // Создаем админа
        const result = await client.query(
            `INSERT INTO users (username, email, password, role, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) 
             RETURNING id`,
            ['admin', 'admin@example.com', hashedPassword, 'admin']
        );

        // Подтверждаем транзакцию
        await client.query('COMMIT');
        console.log('Админ успешно создан');
        console.log('Логин: admin');
        console.log('Пароль: admin');

    } catch (error) {
        // Откатываем транзакцию в случае ошибки
        await client.query('ROLLBACK');
        console.error('Ошибка при создании админа:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

=======
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const client = await pool.connect();
    try {
        // Начинаем транзакцию
        await client.query('BEGIN');

        // Проверяем, существует ли уже админ
        const adminExists = await client.query(
            "SELECT * FROM users WHERE username = 'admin'"
        );

        if (adminExists.rows.length > 0) {
            console.log('Админ уже существует');
            return;
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash('admin', 10);

        // Создаем админа
        const result = await client.query(
            `INSERT INTO users (username, email, password, role, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) 
             RETURNING id`,
            ['admin', 'admin@gmail.com', hashedPassword, 'admin']
        );

        // Подтверждаем транзакцию
        await client.query('COMMIT');
        console.log('Админ успешно создан');
        console.log('Логин: admin');
        console.log('Пароль: admin');

    } catch (error) {
        // Откатываем транзакцию в случае ошибки
        await client.query('ROLLBACK');
        console.error('Ошибка при создании админа:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

>>>>>>> cb358ef (Initial commit)
createAdmin(); 