# 練習問題と正解クエリ

## 環境起動

```bash
# コンテナ起動
docker run --name pg_sql_basic -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:16

# psql に接続
docker exec -it pg_sql_basic psql -U postgres
```

---

## Q1. 全ユーザーを取得する

```sql
SELECT * FROM users;
```

---

## Q2. 年齢が25以上のユーザーを取得する

```sql
SELECT * FROM users WHERE age >= 25;
```

---

## Q3. id が 1 または 3 のユーザーを取得する

```sql
SELECT * FROM users WHERE id IN (1, 3);
```

---

## Q4. ユーザーごとの注文合計金額を出す（user_id 昇順）

```sql
SELECT user_id, SUM(price) FROM orders GROUP BY user_id ORDER BY user_id ASC;
```

---
