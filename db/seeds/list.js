exports.seed = function(knex, Promise) {
  return knex('list').del()
    .then(function () {
      return Promise.all([
        knex('list').insert({id: 1, list_name: 'watch', list_createdOn: '', user_id: }),
        knex('list').insert({id: 2, list_name: 'eat', list_createdOn: '', user_id: }),
      ])
      .then(function(){
        return knex.raw(`ALTER SEQUENCE list_id_seq RESTART WITH 3`)
      })
    });
};