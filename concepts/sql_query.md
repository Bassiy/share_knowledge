# SQL クエリ基礎

## 概要
SQL でデータを取得するための基本クエリ。SELECT・FROM・WHERE・ORDER BY が中心。

## 理解したこと

### 実行順序チートシート

| 記述順 | 句 | 実行順 | 役割 |
|---|---|---|---|
| 1 | [`SELECT`](#select文) | 5 | 表示する列を決定・関数を計算 |
| 2 | `FROM` | 1 | 対象テーブルを決める |
| 3 | [`WHERE`](#where句での絞り込み) | 2 | 集計前に不要な行を除去 |
| 4 | [`GROUP BY`](sql_aggregation.md#group-by--having) | 3 | 残ったデータをグループに小分け |
| 5 | [`HAVING`](sql_aggregation.md#group-by--having) | 4 | グループをさらに絞り込む |
| 6 | [`ORDER BY`](#order-by句並び替え) | 6 | 最終結果を並び替える |

```
書く順：  SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
実行順：  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

---

### 書くときのイメージ

```
SELECT   → 表示したい項目を指定する
FROM     → 使用するテーブルを決める
WHERE    → 余計な行を弾く
GROUP BY → 残った行を束ねてグループを作る
HAVING   → グループをさらに条件で絞り込む
ORDER BY → 結果を並び替える
```

頭の中では SELECT から考えていいが、DB は FROM から動いている。

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
- sql_aggregation（GROUP BY・HAVING・集計関数）
- sql_join（テーブル結合・サブクエリ）
- sql_dml（INSERT・UPDATE・DELETE）

## 関連実装
- [sql_basic_query](../coding/sql_basic_query/) — PostgreSQLでWHERE・IN・GROUP BYを実際に動かした

## ソース
- 2026-06-08・/study + /code セッションでの壁打ちから整理

## タグ
SQL, SELECT, WHERE, ORDER BY, sqlcmd, PostgreSQL, SQL Server, リレーショナルDB
