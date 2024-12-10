exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('username', 50).notNullable().unique();
        table.string('email', 100).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('avatar', 255);
        table.enu('role', ['user', 'admin']).defaultTo('user');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
}; 