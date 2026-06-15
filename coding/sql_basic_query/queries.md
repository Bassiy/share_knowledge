# 練習問題と正解クエリ

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

## Q4. ユーザーごとの注文合計金額を出す

```sql
SELECT user_id, SUM(price) FROM orders GROUP BY user_id;
```

---
