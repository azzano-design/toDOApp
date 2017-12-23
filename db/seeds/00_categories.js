exports.seed = function(knex, Promise) {
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        knex('categories').insert({id: 1, category_name: 'watch'}),
        knex('categories').insert({id: 2, category_name: 'eat'}),
      ])
      .then(function(){
        return knex.raw(`ALTER SEQUENCE categories_id_seq RESTART WITH 3`)
      })
    });
};