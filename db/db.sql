DROP TABLE IF EXISTS user CASCADE;

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  email VARCHAR(50),
  password VARCHAR(50)
);

INSERT INTO user (id, firstname, lastname, email, password)
 VALUES (1, 'Alex', 'Smith', 'user@example.com', '123');
INSERT INTO user (id, firstname, lastname, email, password)
 VALUES (2,'Richie', 'Rich', 'user1@example.com', '111');
