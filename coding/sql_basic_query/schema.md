# テーブル仕様

## 概要

ユーザーが商品を注文する、シンプルな EC のデータモデル。
`users` と `orders` が 1対多の関係になっている。

---

## テーブル定義

### users

```sql
CREATE TABLE users (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age  INT
);
```

### orders

```sql
CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  item    TEXT NOT NULL,
  price   INT
);
```

---

## 実データ

### users

| id | name    | age |
|----|---------|-----|
| 1  | Alice   | 25  |
| 2  | Bob     | 30  |
| 3  | Charlie | 22  |

### orders

| id | user_id | item   | price |
|----|---------|--------|-------|
| 1  | 1       | Apple  | 100   |
| 2  | 1       | Banana | 200   |
| 3  | 2       | Cherry | 150   |
| 4  | 3       | Apple  | 100   |
| 5  | 3       | Durian | 500   |
