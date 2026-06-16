-- DB・テーブル作成とデータ投入

CREATE DATABASE shop;
\c shop

CREATE TABLE users (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age  INT
);

CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  item    TEXT NOT NULL,
  price   INT
);

INSERT INTO users (name, age) VALUES
  ('Alice',   25),
  ('Bob',     30),
  ('Charlie', 22),
  ('Dave',    28);  -- 注文なし：LEFT JOIN の違いを確認するために追加

INSERT INTO orders (user_id, item, price) VALUES
  (1, 'Apple',  100),
  (1, 'Banana', 200),
  (2, 'Cherry', 150),
  (3, 'Apple',  100),
  (3, 'Durian', 500);
