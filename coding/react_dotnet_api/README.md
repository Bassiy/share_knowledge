# react_dotnet_api

## 目的
C#（ASP.NET Core Web API）をバックエンド、React（fetch）をフロントエンドにした、言語をまたいだ連携を試す。
- ASP.NET Core側でJSONを返すエンドポイントを作る
- Reactの`fetch`でそれを取得し、画面に表示する
- CORS・JSONのシリアライズ/デシリアライズが実際にどこで効いてくるかを体感する

## 実行方法
1. `backend/`で`dotnet run`（`http://localhost:5080`で起動）
2. `frontend/index.html`をブラウザで直接開く（npm installやバンドラは不要。React/ReactDOM/BabelはCDNから読み込み）

## ファイル構成
```
react_dotnet_api/
├── README.md
├── sample/
│   ├── backend/
│   │   ├── Backend.csproj
│   │   └── Program.cs      # 完成版参考実装（GET/POST + CORS）
│   └── frontend/
│       ├── index.html
│       └── app.jsx          # 完成版参考実装（fetch + async/await）
└── work/
    ├── backend/
    │   ├── Backend.csproj
    │   └── Program.cs       # 自分で書いた実装
    └── frontend/
        ├── index.html
        └── app.jsx           # 自分で書いた実装
```

## 学び
- CORS: `file://`で開いたReact側は`Origin: null`を送ってくる。サーバー側で`AllowAnyOrigin()`しないとブラウザにブロックされる（`curl -H "Origin: null"`でpreflightの挙動を実際に確認した）
- C#の`record Note(int Id, string Text)`はPascalCaseで定義しているのに、ASP.NET CoreのデフォルトJSONシリアライザ（System.Text.Json）が出力時に自動でcamelCase（`id`, `text`）へ変換する
- `record`のプロパティ名は慣習でPascalCaseだが、コンパイラが強制しているわけではない。小文字（`id`, `text`）で書いてもコンパイルは通る
- `dotnet run`で起動したプロセスは、別のBashセッションから`kill %1`しても実際には止まっていないことがあった（バックグラウンドジョブのジョブ番号はシェルセッションごとにリセットされるため）。`lsof -i :ポート番号`で確認するのが確実
- フォアグラウンドで`dotnet run`している場合、ASP.NET Coreはgraceful shutdownの仕組みを内蔵しているため`Ctrl+C`（Macでは`Control+C`。`Command+C`はコピーなので効かない）で確実に止まる
- 実装ミスの実例：`notes.Add(note)`と書くべきところを`note.Add(note)`と書いてしまい、`Note`型に`Add`メソッドが存在しないというコンパイルエラーになった（`dotnet build`で確認）
- 実装ミスの実例：`root.render(<APP />)`とタグ名を全部大文字にしてしまい、定義した`App`とは別の未定義変数として扱われた（JSXは大文字小文字を区別し、変数名は完全一致が必要）
- IDEで`WebApplication`が型として認識されない現象が起きたが、`dotnet build`は正常に通った。一度もビルドしていない新規プロジェクトでは、言語サーバーの型解決がまだ追いついていないだけのことがある

## 関連概念
- [react_rendering](../../concepts/react_rendering.md) — マウント/レンダリング/アンマウント・仮想DOMと差分検出の整理
- [javascript_promise](../../concepts/javascript_promise.md) — fetch・Promise・async/awaitの仕組み
