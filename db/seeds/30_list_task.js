exports.seed = function(knex, Promise) {
  return knex('list_task').del()
    .then(function () {
      return Promise.all([
        knex('list_task').insert({id: 1, task_name: 'watch Hackers', list_id: 1, category_id: 1}),
        knex('list_task').insert({id: 2, task_name: 'watch the Star Wars Christmas Special', list_id: 1, category_id: 1}),
      ])
      .then(function(){
        return knex.raw(`ALTER SEQUENCE list_task_id_seq RESTART WITH 3`)
      })
    });
};