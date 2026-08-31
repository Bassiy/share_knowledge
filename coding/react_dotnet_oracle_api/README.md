# react_dotnet_oracle_api

## 目的
Notion模倣アプリのPhase 1：React → C# API → Oracle DB の疎通確認。
Mac上で動いているOracle DB（[mac_linux_db_connection](../mac_linux_db_connection/)、`FREEPDB1`、`app_schema`経由で`Pages`テーブルにアクセス可能、サンプルデータ投入済み）に対し、C# ASP.NET Core Web APIから ODP.NET（`Oracle.ManagedDataAccess`）で接続して`Pages`を取得するエンドポイントを作り、Reactでフラットな一覧として読み取り専用表示する。

## 実行方法
1. Mac上のOracleコンテナ（[mac_linux_db_connection](../mac_linux_db_connection/)）を起動しておく
2. `backend/`で`dotnet run`（`http://localhost:5081`で起動。`react_dotnet_api`の5080と衝突しないよう別ポート）
3. `frontend/`を簡易HTTPサーバーで配信し`index.html`を開く（`python3 -m http.server`など。`file://`だとブラウザ拡張の都合で確認できないことがあるため）

## ファイル構成
```
react_dotnet_oracle_api/
├── README.md
├── sample/
│   ├── backend/
│   │   ├── Backend.csproj      # Oracle.ManagedDataAccess.Core参照
│   │   └── Program.cs           # 完成版参考実装（ODP.NETでOracle接続 + GET /api/pages）
│   └── frontend/
│       ├── index.html
│       └── app.jsx               # 完成版参考実装（Container/Presentational分離）
└── work/
    ├── backend/
    │   ├── Backend.csproj
    │   └── Program.cs            # 自分で書く実装
    └── frontend/
        ├── index.html
        └── app.jsx                # 自分で書く実装
```

## 学び
（気づきが生まれた時点で都度追記する）

## 関連概念
（セッション終了後に追記）
