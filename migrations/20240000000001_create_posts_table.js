<<<<<<< HEAD
exports.up = function(knex) {
    return knex.schema
        .createTable('posts', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('title', 255).notNullable();
            table.text('content').notNullable();
            table.string('image', 255);
            table.integer('likes').defaultTo(0);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            
            table.foreign('user_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
        })
        .then(() => {
            return knex.raw(`
                CREATE OR REPLACE FUNCTION reset_posts_id_seq() 
                RETURNS void AS $$
                BEGIN
                    PERFORM setval('posts_id_seq', COALESCE((SELECT MAX(id) FROM posts), 0), true);
                END;
                $$ LANGUAGE plpgsql;
            `);
        });
};

exports.down = function(knex) {
    return knex.schema
        .raw('DROP FUNCTION IF EXISTS reset_posts_id_seq()')
        .dropTable('posts');
=======
exports.up = function(knex) {
    return knex.schema
        .createTable('posts', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('title', 255).notNullable();
            table.text('content').notNullable();
            table.string('image', 255);
            table.integer('likes').defaultTo(0);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            
            table.foreign('user_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
        })
        .then(() => {
            return knex.raw(`
                CREATE OR REPLACE FUNCTION reset_posts_id_seq() 
                RETURNS void AS $$
                BEGIN
                    PERFORM setval('posts_id_seq', COALESCE((SELECT MAX(id) FROM posts), 0), true);
                END;
                $$ LANGUAGE plpgsql;
            `);
        });
};

exports.down = function(knex) {
    return knex.schema
        .raw('DROP FUNCTION IF EXISTS reset_posts_id_seq()')
        .dropTable('posts');
>>>>>>> cb358ef (Initial commit)
}; 