# mac_linux_db_connection

## 目的
Macでアプリを起動し、別のLinux PCで動かしたOracle DB（Docker）に接続する構成を実際に組んで疎通確認する。Notion模倣アプリ（React → C# API → Oracle DB）の Phase 0 として、スキーマ分離（`data_schema`/`app_schema` + シノニム）まで実施。

その後Linux PCが不調になったため、同じ手順がMac単体（Docker Desktop on Apple Silicon）でも再現できるか確認した。結果、`docker_setup.sh`・`schema_setup.sql`とも無変更で通り、接続先を`localhost`に変えるだけで完全に同じ手順が使えた。

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

## ファイル構成
```
mac_linux_db_connection/
├── README.md
├── connection_info.md   # 接続情報一覧
├── docker_setup.sh       # Linux側：Oracleコンテナ起動コマンド
└── schema_setup.sql      # ユーザー作成〜シノニム作成〜疎通確認のSQL
```

## 学び
- Dockerの環境変数名は `ORACLE_PWD` ではなく `ORACLE_PASSWORD`。誤指定すると起動失敗する
- 接続先は `FREE`（CDB root）ではなく `FREEPDB1`（PDB）を指定する必要がある。`FREE`に繋ぐと`ORA-65096`エラーになる（[oracle_cdb_pdb](../../concepts/oracle_cdb_pdb.md)参照）
- `sqlplus`から`shutdown`を実行するとコンテナ自体は`Exited (143)`で停止する。`docker start`で再起動すれば復帰する
- Oracleでは「接続ユーザー＝スキーマ」。`SYSTEM`ユーザーで接続したまま`CREATE TABLE`すると、意図せず`SYSTEM`スキーマにテーブルができてしまう。原因はこの仕様の理解不足で、`data_schema`専用の接続に切り替えて解決した
- Oracleの識別子はクォートなしだと自動大文字化される。SQL Developerの接続ユーザー名欄は識別子解釈なので小文字でも通るが、スキーマフィルタの検索欄は単純文字列一致のため大文字で検索しないとヒットしない
- スキーマ分離（実テーブルは`data_schema`、アプリ接続は`app_schema`のシノニム経由）を実際に手を動かして構築すると、「アプリ側の接続情報を変えずに実データの配置を変更できる」という設計意図が体感として腑に落ちた

## 関連概念
- [oracle_cdb_pdb](../../concepts/oracle_cdb_pdb.md) — `FREE`（CDB）と`FREEPDB1`（PDB）の違い、接続先を誤ると`ORA-65096`になる理由
- [oracle_schema_separation](../../concepts/oracle_schema_separation.md) — `data_schema`/`app_schema`をシノニムで分離する設計
- [n_tier_architecture](../../concepts/n_tier_architecture.md) — React → C# API → Oracle DBの3層構成の一部としての本実験の位置付け
