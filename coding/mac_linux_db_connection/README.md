# mac_linux_db_connection

## 目的
Macでアプリを起動し、別のLinux PCで動かしたOracle DB（Docker）に接続する構成を実際に組んで疎通確認する。Notion模倣アプリ（React → C# API → Oracle DB）の Phase 0 として、スキーマ分離（`data_schema`/`app_schema` + シノニム）まで実施。

その後Linux PCが不調になったため、同じ手順がMac単体（Docker Desktop on Apple Silicon）でも再現できるか確認した。結果、`docker_setup.sh`・`schema_setup.sql`とも無変更で通り、接続先を`localhost`に変えるだけで完全に同じ手順が使えた。

## プロジェクト全体像・ロードマップ（Notion模倣アプリ）

本実験（DB接続・スキーマ分離）は、Notion模倣アプリ構築プロジェクトのPhase 0にあたる。

### 技術構成
- フロント：React（Mac、ブラウザ）
- API層：C# ASP.NET Core Web API
- DB：Oracle Database Free（Docker。当初Linux PC想定、現在はMac単体でも代替可能と確認済み）
- 接続：まずは同一LAN内（またはローカル）で疎通確認。外出先アクセスが必要になった場合はTailscale（無料のWireGuardベースVPN）を使う方針

### 模倣対象
Notionの一部機能を模倣する。

### ロードマップ
- **Phase 0（完了）**：Oracleセットアップ＋スキーマ分離設計（`data_schema`/`app_schema`作成、シノニム、権限付与）。本ディレクトリがその実験記録
- **Phase 1（未着手）**：疎通確認（React → C# API → Oracle DB、`Pages`テーブルをフラットな一覧で読み取り表示・読み取り専用）。サンプルデータは投入済み（`sample_data.sql`、親子3階層6件）
- **Phase 2（未着手）**：階層構造（`parent_id`を使ったネスト表示、サイドバーのツリーUI）
- **Phase 3（未着手）**：編集機能（ページの作成・更新・削除、CRUD）

### 参照する設計概念（フロント/バックエンドで役割分担）
- フロント（React側の構造）→ [container_presentational_pattern](../../concepts/container_presentational_pattern.md)
- バックエンド（3層構成そのもの）→ [n_tier_architecture](../../concepts/n_tier_architecture.md)

### 補足検討（API層の言語について）
バックエンドをTypeScript（Node.js/Express）にする案も検討したが見送り、C#継続で決定。
- アーキテクチャ的には言語非依存：React↔API↔DBの3層構成なら、API層の中身がC#かTSかはフロント側から見えない
- 今回の主目的は「アーキテクチャの実践＝動くものを作ること」なので、学習コストが低いC#で確実に完走する方針
- 将来の伸び代（優先度低）：v1が動いた後、同じAPI仕様をTypeScriptで再実装してC#版と置き換える実験をすると、「アーキテクチャの層が言語に依存しない」ことを実体験できる
- Phase 1実装時は、React↔C# API連携の実験記録である[react_dotnet_api](../react_dotnet_api/)（CORS・JSONシリアライズ周りの学びあり）をベースにする想定

## 実行方法

### パターンA：Linux PC + Mac（LAN経由、当初の構成）
1. Linux PC側で `docker_setup.sh` を実行し、Oracle Database Free（`FREEPDB1`）を起動
2. Mac側のSQL Developerから `connection_info.md` の接続情報でLAN経由接続
3. `schema_setup.sql` を上から順に実行（Step 1〜3は接続ユーザーを切り替えながら実行する必要あり。詳細はファイル内コメント参照）
4. 最後の `SELECT * FROM Pages;` が通れば疎通確認完了

### パターンB：Mac単体（Linux PC不調時の代替。手順は同一）
1. Mac上のDocker Desktopで `docker_setup.sh` をそのまま実行
2. 接続先は`localhost:1521/FREEPDB1`（LAN内IP不要）
3. `schema_setup.sql` を上から順に実行
4. 最後の `SELECT * FROM Pages;` が通れば疎通確認完了
5. `sample_data.sql` を`data_schema`で実行し、Pagesにサンプルデータ（親子3階層、計6件）を投入。`app_schema`側から`SELECT`しても同じ内容が見えることを確認済み

## ファイル構成
```
mac_linux_db_connection/
├── README.md
├── connection_info.md   # 接続情報一覧
├── docker_setup.sh       # Linux側：Oracleコンテナ起動コマンド
├── schema_setup.sql      # ユーザー作成〜シノニム作成〜疎通確認のSQL
└── sample_data.sql       # Pagesテーブルへのサンプルデータ投入（親子3階層）
```

## 学び
- Dockerの環境変数名は `ORACLE_PWD` ではなく `ORACLE_PASSWORD`。誤指定すると起動失敗する
- 接続先は `FREE`（CDB root）ではなく `FREEPDB1`（PDB）を指定する必要がある。`FREE`に繋ぐと`ORA-65096`エラーになる（[oracle_cdb_pdb](../../concepts/oracle_cdb_pdb.md)参照）
- `sqlplus`から`shutdown`を実行するとコンテナ自体は`Exited (143)`で停止する。`docker start`で再起動すれば復帰する
- Oracleでは「接続ユーザー＝スキーマ」。`SYSTEM`ユーザーで接続したまま`CREATE TABLE`すると、意図せず`SYSTEM`スキーマにテーブルができてしまう。原因はこの仕様の理解不足で、`data_schema`専用の接続に切り替えて解決した
- Oracleの識別子はクォートなしだと自動大文字化される。SQL Developerの接続ユーザー名欄は識別子解釈なので小文字でも通るが、スキーマフィルタの検索欄は単純文字列一致のため大文字で検索しないとヒットしない
- スキーマ分離（実テーブルは`data_schema`、アプリ接続は`app_schema`のシノニム経由）を実際に手を動かして構築すると、「アプリ側の接続情報を変えずに実データの配置を変更できる」という設計意図が体感として腑に落ちた
- `gvenzl/oracle-free`は2024年9月以降マルチプラットフォーム対応済みで、Apple Silicon（arm64）でもエミュレーションなしでネイティブ動作する。`docker run`のコマンドはLinux/Mac間で変更不要（`docker info`の`Architecture`で確認可能）

## 関連概念
- [oracle_cdb_pdb](../../concepts/oracle_cdb_pdb.md) — `FREE`（CDB）と`FREEPDB1`（PDB）の違い、接続先を誤ると`ORA-65096`になる理由
- [oracle_schema_separation](../../concepts/oracle_schema_separation.md) — `data_schema`/`app_schema`をシノニムで分離する設計
- [n_tier_architecture](../../concepts/n_tier_architecture.md) — React → C# API → Oracle DBの3層構成の一部としての本実験の位置付け
- [container_presentational_pattern](../../concepts/container_presentational_pattern.md) — Phase 1以降のReact側実装で参照する設計パターン
