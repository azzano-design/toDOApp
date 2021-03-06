exports.up = function(knex, Promise) {
  return knex.schema.createTable('list', function (table) {
    table.increments();
    table.string('list_name');
    table.timestamps('list_createdOn');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('list');
};
