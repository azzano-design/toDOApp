exports.seed = function(knex, Promise) {
  return knex('list_task').del()
    .then(function () {
      return Promise.all([
        knex('list_task').insert({id: 1, task_name: 'watch', created_at: '', updated_at: '', list_id: , category_id: }),
        knex('list_task').insert({id: 1, task_name: 'watch', created_at: '', updated_at: '', list_id: , category_id: }),
      ])
      .then(function(){
        return knex.raw(`ALTER SEQUENCE list_task_id_seq RESTART WITH 3`)
      })
    });
};