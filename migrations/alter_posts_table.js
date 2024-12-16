exports.up = function(knex) {
    return knex.schema.alterTable('posts', function(table) {
        table.integer('category_id').nullable().alter(); // Разрешаем `NULL` для category_id
    });
};
