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
SELECT
    フィールド名1,
    フィールド名2
FROM
    テーブル名;

-- エイリアス（ヘッダ名を変える）
SELECT
    title AS タイトル
FROM
    m_album;

-- ※ SELECT * は原則NG（重くなる・後から追加した列の影響を受ける）
--   COUNT(*) の * は例外（行数を数えるための決まり文句）
```

---

### WHERE句での絞り込み

行を絞り込む条件を指定する。`GROUP BY` の前に実行される（集計前フィルタ）。

| 演算子 | 用途 | 例 |
|---|---|---|
| `=` `!=` `<>` | 一致・不一致（`!=` と `<>` は同じ） | `price != 3000` |
| `AND` `OR` `NOT` | 論理演算 | `label_id = 3 AND status = '販売中'` |
| `IN` | 複数候補のどれかと一致 | `artist_id IN (2, 5)` |
| `BETWEEN` | 範囲指定（両端含む） | `artist_id BETWEEN 4 AND 8` |
| `LIKE` | あいまい検索 | `artist_name LIKE '%Band%'` |

```sql
-- 基本
SELECT title FROM m_album WHERE label_id = 3;

-- 比較演算子（!= と <> は同じ）
WHERE price != 3000
WHERE price <> 3000

-- 論理演算子
WHERE label_id = 3 AND status = '販売中'
WHERE label_id = 3 OR label_id = 5
WHERE NOT genre_id = 3

-- IN演算子（複数候補のどれかと一致）
WHERE artist_id IN (2, 5);

-- BETWEEN演算子（範囲指定、両端を含む）
WHERE artist_id BETWEEN 4 AND 8;

-- LIKE演算子（あいまい検索）
WHERE artist_name LIKE '%Band%';
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
    title ASC;

-- 降順
ORDER BY
    title DESC;

-- 複数フィールドで指定
ORDER BY
    label_id ASC,
    title DESC;
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
SELECT COUNT(*) AS cnt FROM m_artist;
```

```sql
-- GROUP BY（グループ化してからCOUNT）
SELECT
    country_id,
    country_name,
    COUNT(*) AS cnt
FROM
    m_artist
GROUP BY
    country_id, country_name;
```

```sql
-- HAVING（グループ化した結果をさらに絞り込む）
SELECT
    country_id,
    country_name,
    COUNT(*) AS cnt
FROM
    m_artist
GROUP BY
    country_id, country_name
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
    t1.title,
    t2.artist_name
FROM
    m_album t1
INNER JOIN
    m_artist t2 ON t1.artist_id = t2.artist_id;
```

```sql
-- 3テーブル結合
SELECT
    t1.title,
    t2.artist_name,
    t3.genre_name
FROM
    m_album t1
INNER JOIN
    m_artist t2 ON t1.artist_id = t2.artist_id
INNER JOIN
    m_genre t3 ON t1.genre_id = t3.genre_id;
```

---

### サブクエリ

SELECT文を `()` で括って入れ子にする。複数の処理を1つの命令にまとめられる。

```sql
SELECT
    artist_id,
    artist_name
FROM
    m_artist
WHERE
    artist_id IN (SELECT artist_id FROM m_album);
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
-- INSERT（レコード挿入）
INSERT INTO m_genre(genre_id, genre_name) VALUES(4, 'Jazz');

-- UPDATE（レコード更新）
UPDATE m_genre SET genre_name = 'Ambient' WHERE genre_id = 6;

-- DELETE（レコード削除）
DELETE FROM m_genre WHERE genre_id = 4;
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

### サンプルテーブル

このファイルの例をすべて実行できる仮テーブル。

**m_genre**

| genre_id | genre_name |
|----------|------------|
| 1 | Pop |
| 2 | Rock |
| 3 | Classical |
| 6 | Electronic |

**m_artist**

| artist_id | artist_name | country_id | country_name |
|-----------|-------------|------------|--------------|
| 1 | Echo Band | 1 | 日本 |
| 2 | Luna Project | 1 | 日本 |
| 3 | Nova Sound | 2 | アメリカ |
| 4 | Sky Orchestra | 2 | アメリカ |
| 5 | Deep Groove | 2 | アメリカ |
| 6 | Frost Music | 3 | ドイツ |
| 7 | Amber Wave | 3 | ドイツ |
| 8 | Coral Beats | 4 | フランス |

**m_album**

| album_id | title | label_id | status | artist_id | genre_id | price |
|----------|-------|----------|--------|-----------|----------|-------|
| 1 | Sunrise | 3 | 販売中 | 1 | 1 | 2800 |
| 2 | Moonlight | 3 | 販売中 | 2 | 2 | 3000 |
| 3 | Dark Matter | 3 | 廃盤 | 3 | 1 | 3500 |
| 4 | Aurora | 5 | 販売中 | 4 | 3 | 2500 |
| 5 | Nebula | 5 | 販売中 | 5 | 2 | 3200 |
| 6 | Glacier | 5 | 販売中 | 6 | 1 | 2900 |
| 7 | Storm | 1 | 販売中 | 7 | 3 | 3800 |
| 8 | Tide | 2 | 販売中 | 8 | 1 | 2200 |

```sql
CREATE TABLE m_genre (
    genre_id   INT PRIMARY KEY,
    genre_name TEXT NOT NULL
);

CREATE TABLE m_artist (
    artist_id   INT PRIMARY KEY,
    artist_name TEXT NOT NULL,
    country_id  INT,
    country_name TEXT
);

CREATE TABLE m_album (
    album_id  SERIAL PRIMARY KEY,
    title     TEXT NOT NULL,
    label_id  INT,
    status    TEXT,
    artist_id INT REFERENCES m_artist(artist_id),
    genre_id  INT REFERENCES m_genre(genre_id),
    price     INT
);
```

```sql
INSERT INTO m_genre VALUES
    (1, 'Pop'),
    (2, 'Rock'),
    (3, 'Classical'),
    (6, 'Electronic');   -- UPDATE例で 'Ambient' に変更される

INSERT INTO m_artist VALUES
    (1, 'Echo Band',      1, '日本'),
    (2, 'Luna Project',   1, '日本'),
    (3, 'Nova Sound',     2, 'アメリカ'),
    (4, 'Sky Orchestra',  2, 'アメリカ'),
    (5, 'Deep Groove',    2, 'アメリカ'),
    (6, 'Frost Music',    3, 'ドイツ'),
    (7, 'Amber Wave',     3, 'ドイツ'),
    (8, 'Coral Beats',    4, 'フランス');

INSERT INTO m_album (title, label_id, status, artist_id, genre_id, price) VALUES
    ('Sunrise',     3, '販売中', 1, 1, 2800),
    ('Moonlight',   3, '販売中', 2, 2, 3000),
    ('Dark Matter', 3, '廃盤',   3, 1, 3500),
    ('Aurora',      5, '販売中', 4, 3, 2500),
    ('Nebula',      5, '販売中', 5, 2, 3200),
    ('Glacier',     5, '販売中', 6, 1, 2900),
    ('Storm',       1, '販売中', 7, 3, 3800),
    ('Tide',        2, '販売中', 8, 1, 2200);
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
