# SQL クエリ基礎

## 概要
リレーショナルDBに対してデータを取得・操作するための言語。SELECT/INSERT/UPDATE/DELETE が基本。

## 理解したこと

### 実行順序

記述順と実行順は異なる。「何を見せるか（SELECT）」を最初に書くが、実際にはデータソースを決めてから絞り込んでいく。

| 記述順 | 句 | 実行順 | 役割 |
|---|---|---|---|
| 1 | [`SELECT`](#select文) | 5 | 表示する列を決定・関数を計算 |
| 2 | `FROM` | 1 | 対象テーブルを決める |
| 3 | [`WHERE`](#where句での絞り込み) | 2 | 集計前に不要な行を除去 |
| 4 | [`GROUP BY`](#group-by--having) | 3 | 残ったデータをグループに小分け |
| 5 | [`HAVING`](#group-by--having) | 4 | グループをさらに絞り込む |
| 6 | [`ORDER BY`](#order-by句並び替え) | 6 | 最終結果を並び替える |

---

### SELECT文

```sql
-- 基本
SELECT
    列名1,
    列名2
FROM
    テーブル名;

-- エイリアス（ヘッダ名を変える）
SELECT
    列名 AS 別名
FROM
    テーブル名;

-- ※ SELECT * は原則NG（重くなる・後から追加した列の影響を受ける）
--   COUNT(*) の * は例外（行数を数えるための決まり文句）
```

---

### WHERE句での絞り込み

行を絞り込む条件を指定する。`GROUP BY` の前に実行される（集計前フィルタ）。

| 演算子 | 用途 | 例 |
|---|---|---|
| `=` `!=` `<>` | 一致・不一致（`!=` と `<>` は同じ） | `price != 3000` |
| `AND` `OR` `NOT` | 論理演算 | `col1 = 1 AND col2 = '値'` |
| `IN` | 複数候補のどれかと一致 | `id IN (1, 2)` |
| `BETWEEN` | 範囲指定（両端含む） | `id BETWEEN 4 AND 8` |
| `LIKE` | あいまい検索 | `name LIKE '%文字%'` |

```sql
-- 比較演算子（!= と <> は同じ）
WHERE price != 3000
WHERE price <> 3000

-- 論理演算子
WHERE col1 = 1 AND col2 = '値'
WHERE col1 = 1 OR col1 = 2
WHERE NOT col1 = 3

-- IN（複数候補のどれかと一致）
WHERE id IN (1, 2);

-- BETWEEN（範囲指定、両端を含む）
WHERE id BETWEEN 4 AND 8;

-- LIKE（あいまい検索）
WHERE name LIKE '%文字%';
--   'A%'    : Aで始まる
--   '%A'    : Aで終わる
--   '%A%'   : Aを含む
--   'B%A%'  : Bで始まり、Aを含む
```

---

### ORDER BY句（並び替え）

```sql
-- 昇順（デフォルト）
ORDER BY
    列名 ASC;

-- 降順
ORDER BY
    列名 DESC;

-- 複数列で指定
ORDER BY
    列名A ASC,
    列名B DESC;
```

---

### GROUP BY + HAVING

`WHERE` と `HAVING` は実行タイミングが違う。

| 句 | 実行タイミング | 用途 |
|---|---|---|
| `WHERE` | グループ化**前** | 行を絞り込む |
| `HAVING` | グループ化**後** | 集計結果を絞り込む |

**誤解しやすいポイント：**

「WHERE は行を処理、GROUP BY は列を処理」→ **どちらも行を処理している**。

| 句 | 何を処理するか | 操作 |
|---|---|---|
| `WHERE` | 行 | 条件に合わない行を**捨てる** |
| `GROUP BY` | 行 | 同じ値の行を**束ねる** |
| `HAVING` | グループ（束） | 条件に合わないグループを**捨てる** |

GROUP BY は「列の値が同じ行をひとまとめにする」操作。列ではなく行が対象。

流れのイメージ：

```
全レコード
  ↓ WHERE（余計な行を捨てる）
残った行
  ↓ GROUP BY（同じ行を束ねる）
グループ
  ↓ HAVING（グループを取捨選択する）
絞り込まれたグループ
```

```sql
-- COUNT（レコード数を数える）
SELECT COUNT(*) AS cnt FROM テーブル名;

-- GROUP BY（グループ化してからCOUNT）
SELECT
    グループ列,
    COUNT(*) AS cnt
FROM
    テーブル名
GROUP BY
    グループ列;

-- HAVING（グループ化した結果をさらに絞り込む）
SELECT
    グループ列,
    COUNT(*) AS cnt
FROM
    テーブル名
GROUP BY
    グループ列
HAVING
    COUNT(*) >= 2;
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
