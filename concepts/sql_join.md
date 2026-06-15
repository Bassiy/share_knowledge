# SQL テーブル結合

## 概要
複数テーブルを外部キーで結合する操作。INNER JOIN / LEFT JOIN / RIGHT JOIN の使い分けとサブクエリ。

## 理解したこと

### JOIN（テーブル結合）

複数テーブルを共通フィールド（FK）で結合する。外部キーを持つ方を `FROM`、主キーのある方を `JOIN` に書く。

| 種類 | 動作 |
|---|---|
| `INNER JOIN` | 両テーブルに一致するレコードのみ取得。`INNER` は省略可能 |
| `LEFT OUTER JOIN` | 左テーブルを全件取得。右に一致なければ NULL |
| `RIGHT OUTER JOIN` | 右テーブルを全件取得。左に一致なければ NULL |

```sql
-- 2テーブル結合
SELECT
    t1.列名,
    t2.列名
FROM
    テーブルA t1
INNER JOIN
    テーブルB t2 ON t1.キー = t2.キー;

-- 3テーブル結合
SELECT
    t1.列名,
    t2.列名,
    t3.列名
FROM
    テーブルA t1
INNER JOIN
    テーブルB t2 ON t1.キー = t2.キー
INNER JOIN
    テーブルC t3 ON t1.キー = t3.キー;
```

---

### サブクエリ

SELECT文を `()` で括って入れ子にする。複数の処理を1つの命令にまとめられる。

```sql
SELECT
    列名1,
    列名2
FROM
    テーブルA
WHERE
    キー IN (SELECT キー FROM テーブルB);
```

---

## 関連概念
- sql_query（実行順序・SELECT・WHERE の基本）
- normalization（正規化されたテーブル設計があってこそ JOIN が意味を持つ）
- db_design（テーブル設計・主キー・外部キーの概念）

## 関連実装
- [sql_basic_query](../coding/sql_basic_query/) — PostgreSQLでINNER JOINを実際に動かした

## ソース
- 2026-06-08・/study + /code セッションでの壁打ちから整理

## タグ
SQL, JOIN, INNER JOIN, LEFT JOIN, RIGHT JOIN, サブクエリ, PostgreSQL
