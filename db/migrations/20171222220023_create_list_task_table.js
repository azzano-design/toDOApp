exports.up = function(knex, Promise) {
  return knex.schema.createTable('list_task', function (table) {
    table.increments();
    table.string('task_name');
    table.timestamps('create_time');
    table.integer('list_id').unsigned();
    table.foreign('list_id').references('list.id').onDelete('CASCADE');
    table.integer('category_id').unsigned();
    table.foreign('category_id').references('categories.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('list_task');
};