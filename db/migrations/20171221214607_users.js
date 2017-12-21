
exports.up = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function (exists) {
    if(exists) {
      return knex.schema.table('users', function(table){
          table.increments('id').primary();
          table.string('firstname');
          table.string('lastname');
          table.string('email');
          table.string('password');
      })
    }

      else {
        return knex.schema.createTable('users', function(table){
          table.increments('id').primary();
          table.string('firstname');
          table.string('lastname');
          table.string('email');
          table.string('password');
      });
    }
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
