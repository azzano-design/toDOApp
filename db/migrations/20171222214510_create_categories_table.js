exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', function (table) {
    table.increments();
    table.string('category_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories');
};
