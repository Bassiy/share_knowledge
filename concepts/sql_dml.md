# SQL DML（データ操作）

## 概要
データを変更するための操作。INSERT・UPDATE・DELETE が基本。

## 理解したこと

### DML（データ操作）

DELETE/UPDATE の前に同じ WHERE 条件で SELECT して対象を確認するのが定石。

| 操作 | 構文 |
|---|---|
| INSERT | `INSERT INTO テーブル(col1, col2) VALUES(val1, val2);` |
| UPDATE | `UPDATE テーブル SET col = val WHERE 条件;` |
| DELETE | `DELETE FROM テーブル WHERE 条件;` |

```sql
-- INSERT
INSERT INTO テーブル名(列1, 列2) VALUES(値1, 値2);

-- UPDATE
UPDATE テーブル名 SET 列名 = 新しい値 WHERE 条件;

-- DELETE
DELETE FROM テーブル名 WHERE 条件;
```

---

## 関連概念
- sql_query（SELECT で対象確認してから DML を実行するのが定石）

## ソース
- 2026-06-08・/study + /code セッションでの壁打ちから整理

## タグ
SQL, INSERT, UPDATE, DELETE, DML, PostgreSQL
