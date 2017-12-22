exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, firstname: 'Alice', lastname: 'Smith', username: 'asmith', email:'user@example.com', password: '123'}),
        knex('users').insert({id: 2, firstname: 'Bob', lastname: 'Smith', username: 'bsmith', email:'user1@example.com', password: '123'}),
        knex('users').insert({id: 3, firstname: 'Richie', lastname: 'Rich', username: 'rrich', email:'user2@example.com', password: '123'})
      ])
      .then(function(){
        return knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH 4`)
      })
    });
};
