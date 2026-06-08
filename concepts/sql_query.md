# SQL クエリ基礎

## 概要
リレーショナルDBに対してデータを取得・操作するための言語。SELECT/INSERT/UPDATE/DELETE が基本。

## 理解したこと

### 実行順序

記述順と実行順は異なる。「何を見せるか（SELECT）」を最初に書くが、実際にはデータソースを決めてから絞り込んでいく。

| 記述順 | 句 | 実行順 | 役割 |
|---|---|---|---|
| 1 | `SELECT` | 5 | 表示する列を決定・関数を計算 |
| 2 | `FROM` | 1 | 対象テーブルを決める |
| 3 | `WHERE` | 2 | 集計前に不要な行を除去 |
| 4 | `GROUP BY` | 3 | 残ったデータをグループに小分け |
| 5 | `HAVING` | 4 | グループをさらに絞り込む |
| 6 | `ORDER BY` | 6 | 最終結果を並び替える |

---

### SELECT文

```sql
-- 基本
SELECT フィールド名1, フィールド名2 FROM テーブル名;

-- エイリアス（ヘッダ名を変える）
SELECT person_lname AS 苗字 FROM m_person;

-- ※ SELECT * は原則NG（重くなる・後から追加した列の影響を受ける）
--   COUNT(*) の * は例外（行数を数えるための決まり文句）
```

---

### WHERE句での絞り込み

行を絞り込む条件を指定する。`GROUP BY` の前に実行される（集計前フィルタ）。

| 演算子 | 用途 | 例 |
|---|---|---|
| `=` `!=` `<>` | 一致・不一致（`!=` と `<>` は同じ） | `age != 30` |
| `AND` `OR` `NOT` | 論理演算 | `dept_id = 3 AND status = '在籍中'` |
| `IN` | 複数候補のどれかと一致 | `company_id IN (2, 5)` |
| `BETWEEN` | 範囲指定（両端含む） | `company_id BETWEEN 4 AND 8` |
| `LIKE` | あいまい検索 | `company_name LIKE '%株式会社%'` |

LIKE のパターン：

| パターン | 意味 |
|---|---|
| `'A%'` | Aで始まる |
| `'%A'` | Aで終わる |
| `'%A%'` | Aを含む |
| `'B%A%'` | Bで始まり、Aを含む |

---

### ORDER BY句（並び替え）

```sql
-- 昇順（デフォルト）
ORDER BY person_lname ASC;

-- 降順
ORDER BY person_lname DESC;

-- 複数フィールドで指定
ORDER BY dept_id ASC, person_lname DESC;
```

---

### GROUP BY + HAVING

`WHERE` と `HAVING` は実行タイミングが違う。

| 句 | 実行タイミング | 用途 |
|---|---|---|
| `WHERE` | グループ化**前** | 行を絞り込む |
| `HAVING` | グループ化**後** | 集計結果を絞り込む |

```sql
SELECT dept_id, COUNT(*) AS 社員数
FROM m_person
WHERE status = '在籍中'
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY COUNT(*) DESC;
```

---

### JOIN（テーブル結合）

複数テーブルを共通フィールド（FK）で結合する。外部キーを持つ方を `FROM`、主キーのある方を `JOIN` に書く。

| 種類 | 動作 |
|---|---|
| `INNER JOIN` | 両テーブルに一致するレコードのみ取得。`INNER` は省略可能 |
| `LEFT OUTER JOIN` | 左テーブルを全件取得。右に一致なければ NULL |
| `RIGHT OUTER JOIN` | 右テーブルを全件取得。左に一致なければ NULL |

```sql
-- 2テーブル結合
SELECT t1.person_lname, t2.company_name
FROM m_person t1
INNER JOIN m_company t2 ON t1.company_id = t2.company_id;

-- 3テーブル結合
SELECT t1.person_lname, t2.company_name, t3.post_name
FROM m_person t1
INNER JOIN m_company t2 ON t1.company_id = t2.company_id
INNER JOIN m_post t3 ON t1.post_id = t3.post_id;
```

---

### サブクエリ

SELECT文を `()` で括って入れ子にする。複数の処理を1つの命令にまとめられる。

```sql
SELECT company_id, company_name
FROM m_company
WHERE company_id IN (SELECT company_id FROM m_person);
```

---

### DML（データ操作）

DELETE/UPDATE の前に同じ WHERE 条件で SELECT して対象を確認するのが定石。

| 操作 | 構文 |
|---|---|
| INSERT | `INSERT INTO テーブル(col1, col2) VALUES(val1, val2);` |
| UPDATE | `UPDATE テーブル SET col = val WHERE 条件;` |
| DELETE | `DELETE FROM テーブル WHERE 条件;` |

---

### sqlcmd（SQL Server 固有の接続ツール）

Microsoft SQL Server に接続・操作するための CLI ツール。PostgreSQL の `psql` に相当する。

```bash
# スクリプトファイルを実行してDB生成
sqlcmd -U sa -i create-testdb.sql

# 対話モードで接続
sqlcmd -U sa

# よく使うフルセット
sqlcmd -S サーバー名 -U ユーザー名 -P パスワード -i ファイル名
```

```sql
-- DB切り替え（sqlcmd内）
USE testdb

-- 実行（sqlcmd内）
GO
```

---

### 用語早見表

| 用語 | 意味 |
|---|---|
| レコード / row / tuple | 行（横方向） |
| フィールド / column / attribute | 列（縦方向） |
| 主キー（PK） | レコードを一意に特定するフィールド。NULL禁止 |
| 外部キー（FK） | 他テーブルの主キーを参照するフィールド。矛盾防止の役割も持つ |
| 複合キー | 複数フィールドを組み合わせたキー |
| リレーション | 共通フィールドをキーとしてテーブル同士を関連付けること |
| クエリ | DBへの問い合わせ全般（SELECT・INSERTなど） |

---

## 関連概念
- dbms（SQLはDBMSへの問い合わせ言語。実行はDBMSが担う）
- normalization（正規化されたテーブル設計があってこそJOINが意味を持つ）
- db_design（テーブル設計・主キー・外部キーの概念）

## 関連実装
- [sql_basic_query](../coding/sql_basic_query/) — PostgreSQLでWHERE・IN・GROUP BYを実際に動かした

## ソース
- 2026-06-08・/study + /code セッションでの壁打ちから整理

## タグ
SQL, SELECT, WHERE, GROUP BY, JOIN, DML, サブクエリ, sqlcmd, PostgreSQL, SQL Server, リレーショナルDB
