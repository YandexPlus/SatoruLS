// const knex = require('knex');
// const db = knex({
//     client: 'postgresql',
//     connection: {
//         host: '176.108.252.232',
//         port: 5432,
//         database: 'satorubase',
//         user: 'postgres',
//         password: 'satoruls',
//         ssl: false
//     },
//     pool: {
//         min: 2,
//         max: 10
//     }
// });

// module.exports = { db }; 


const knex = require('knex');

const db = knex({
    client: 'postgresql',
    connection: {
        connectionString: 'postgresql://postgres:wUCVMOsoNwlDmkdMIgPUMiQVLFlGGzxX@monorail.proxy.rlwy.net:44202/railway',
        ssl: {
            rejectUnauthorized: false // Если подключение через SSL
        }
    },
    pool: {
        min: 2,
        max: 10
    }
});

module.exports = { db };
