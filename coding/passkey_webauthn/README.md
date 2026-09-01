# passkey_webauthn

## 目的
WebAuthn（FIDO2）を使ったパスキーの登録・認証フローを最小構成で実装し、`passkey.md` で学んだ「オリジン紐付け」「チャレンジ・レスポンス」が実装上どう出てくるかを体感する。

## 実行方法
```bash
cd sample  # または work
npm install
npm start
```
`http://localhost:3000` をブラウザで開き、「登録」→「ログイン」の順にボタンを押す。生体認証/PINのプロンプトが出る（Touch ID・Windows Hello・Androidの画面ロックなど、端末に応じたもの）。

## ファイル構成
```
passkey_webauthn/
├── README.md
├── sample/
│   ├── package.json
│   ├── server.js
│   └── public/
│       ├── index.html
│       └── app.jsx
└── work/
    ├── package.json
    ├── server.js
    └── public/
        ├── index.html
        └── app.jsx
```

## 学び
（気づきが生まれた時点で都度追記する）

## 関連概念
（セッション終了後に追記）
