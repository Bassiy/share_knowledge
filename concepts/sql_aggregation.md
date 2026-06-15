# SQL 集計

## 概要
GROUP BY で行を束ね、集計関数で値を計算し、HAVING でグループを絞り込む。

## 理解したこと

### 集計関数

GROUP BY と組み合わせて、グループ内の値を集計する。

| 関数 | 役割 |
|---|---|
| `COUNT(*)` | 行数を数える |
| `SUM(列)` | 合計を出す |
| `AVG(列)` | 平均を出す |
| `MAX(列)` | 最大値を出す |
| `MIN(列)` | 最小値を出す |

```sql
SELECT
    グループ列,
    COUNT(*) AS cnt,
    SUM(数値列) AS 合計,
    AVG(数値列) AS 平均
FROM
    テーブル名
GROUP BY
    グループ列;
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

WHERE で行を捨てる → GROUP BY で行を束ねる → HAVING で束を捨てる

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

## 関連概念
- sql_query（実行順序・SELECT・WHERE の基本）
- sql_join（集計結果と他テーブルを結合するケースで連携）

## 関連実装
- [sql_basic_query](../coding/sql_basic_query/) — PostgreSQLでGROUP BY・SUM・HAVINGを実際に動かした

## ソース
- 2026-06-08・/study + /code セッションでの壁打ちから整理

## タグ
SQL, GROUP BY, HAVING, COUNT, SUM, AVG, 集計関数, PostgreSQL
