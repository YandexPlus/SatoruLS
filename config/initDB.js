<<<<<<< HEAD
const knex = require('knex');
const db = knex({
    client: 'postgresql',
    connection: {
        host: '176.108.252.232',
        port: 5432,
        database: 'satorubase',
        user: 'postgres',
        password: 'satoruls',
        ssl: false
    },
    pool: {
        min: 2,
        max: 10
    }
});

=======
const knex = require('knex');
const db = knex({
    client: 'postgresql',
    connection: {
        host: '176.108.252.232',
        port: 5432,
        database: 'satorubase',
        user: 'postgres',
        password: 'satoruls',
        ssl: false
    },
    pool: {
        min: 2,
        max: 10
    }
});

>>>>>>> cb358ef (Initial commit)
module.exports = { db }; 