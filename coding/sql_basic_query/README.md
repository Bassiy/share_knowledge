# sql_basic_query

## 目的
PostgreSQL を使って SQL の基本クエリ（SELECT / WHERE / JOIN など）を実際に動かして体感する。

## 実行方法
```bash
docker run --name shop-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
psql -h localhost -U postgres -f setup.sql
psql -h localhost -U postgres -d shop -f sample.sql
```

## ファイル構成

```
sql_basic_query/
├── README.md
├── schema.md       # テーブル仕様・データ一覧
├── queries.md      # 練習問題と正解クエリ
└── sample.sql      # 実行用SQLファイル
```

## 学び
- Docker + PostgreSQL でローカルDBサーバを立てる流れを体験した
- `WHERE` で条件絞り込み、`IN` で複数値マッチができる
- `GROUP BY` + `SUM` でユーザーごとの合計を集計できる
- `ORDER BY` で結果を昇順・降順に並び替えられる（`ASC` / `DESC`）
- `HAVING` でグループを条件で絞り込める
- `INNER JOIN` で複数テーブルを外部キーで結合できる
- `GROUP BY` は「列を処理」ではなく「同じ値の行を束ねる」操作
- `WHERE`・`GROUP BY`・`HAVING` の違い：行を捨てる → 行を束ねる → グループを捨てる

## 関連概念
- [sql_query](../../concepts/sql_query.md) — SELECT / WHERE / JOIN などの基本クエリ構文
