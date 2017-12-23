DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS list CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  email VARCHAR(50),
  password VARCHAR(50)
);

INSERT INTO users (id, firstname, lastname, email, password, username)
 VALUES (1, 'Alex', 'Smith', 'user@example.com', '123', '');
INSERT INTO users (id, firstname, lastname, email, password, username)
 VALUES (2,'Richie', 'Rich', 'user1@example.com', '111', '');

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(50)
);

INSERT INTO category (id, category_name)
 VALUES (1, 'watch');
INSERT INTO category (id, category_name)
 VALUES (2, 'eat');

CREATE TABLE list (
  id SERIAL PRIMARY KEY,
  list_name VARCHAR(50),
  list_createdOn TIMESTAMP,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO list (id, list_name, list_createdOn, user_id)
 VALUES (1, 'my_list', '', 2);
INSERT INTO list (id, list_name, list_createdOn, user_id)
 VALUES (2, 'task_to_do', '', 1);

CREATE TABLE list_task (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(50),
  create_time TIMESTAMP,
  list_id INTEGER,
  category_id INTEGER,
  FOREIGN KEY(list_id) REFERENCES list(id) ON DELETE CASCADE,
  FOREIGN KEY(category_id) REFERENCES category(id) ON DELETE CASCADE
);

INSERT INTO list_task (id, task_name, create_time, list_id, category_id)
 VALUES (1, 'eat sushi', '', 2, 2);
INSERT INTO list_task (id, task_name, create_time, list_id, category_id)
 VALUES (1, 'watch star war', '', 1, 1);









