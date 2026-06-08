# テーブル仕様

## users

| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL PRIMARY KEY | 自動採番 |
| name | TEXT NOT NULL | ユーザー名 |
| age | INT | 年齢 |

### データ

| id | name | age |
|----|------|-----|
| 1 | Alice | 25 |
| 2 | Bob | 30 |
| 3 | Charlie | 22 |

---

## orders

| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL PRIMARY KEY | 自動採番 |
| user_id | INT REFERENCES users(id) | 外部キー |
| item | TEXT NOT NULL | 商品名 |
| price | INT | 価格 |

### データ

| id | user_id | item | price |
|----|---------|------|-------|
| 1 | 1 | Apple | 100 |
| 2 | 1 | Banana | 200 |
| 3 | 2 | Cherry | 150 |
| 4 | 3 | Apple | 100 |
| 5 | 3 | Durian | 500 |
