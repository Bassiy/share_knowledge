# 接続情報

| 項目 | 値 |
|---|---|
| Hostname | Linux PCのLAN内IP `192.168.3.11`（Docker on Mac等、同一端末上のDBに繋ぐ場合は`localhost`） |
| Port | `1521` |
| Service Name | `FREEPDB1`（`FREE`ではなくこちら。CDB rootに繋ぐと`ORA-65096`） |
| `system`/`sys`/`pdbadmin`パスワード | `YourStrongPassword`（Dockerの`ORACLE_PASSWORD`で設定） |
| `data_schema`ユーザー / パスワード | `data_schema` / `data_schema`（実テーブル所有スキーマ） |
| `app_schema`ユーザー / パスワード | `app_schema` / `app_schema`（アプリ接続用スキーマ、シノニム経由でアクセス） |

- Oracleの識別子はクォートなしだと自動大文字化される（例：`data_schema`ユーザーは実体は`DATA_SCHEMA`）。SQL Developerの接続ユーザー名欄は識別子解釈されるので小文字入力でも問題ないが、スキーマフィルタの検索欄は単純文字列一致なので大文字で探す必要がある
