
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('firstname');
    table.string('lastname');
    table.string('email');
    table.string('password');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
