# css_transition_basics

## 目的
CSSの`transition`プロパティに絞って、JSがクラスを切り替えた際の見た目の変化を滑らかにする最小構成を試す。
（`classList`操作・`addEventListener`自体はbooking_site_vanilla_jsで経験済みのため、今回は`transition`単体に集中する）

ステップ2として、同じ仕組み（JSがクラス切り替え→CSSのtransitionが補間）をもう少し実務に近いシチュエーション（モーダルダイアログ）に適用し、`display: none`を使うとtransitionが効かないという頻出の落とし穴も確認する。

## 実行方法
ビルドやサーバーは不要。`sample/index.html`（box移動の最小構成）または`sample/modal.html`（モーダル）をブラウザで直接開くだけで動作確認できる。`work/`側も同様。

## ファイル構成
```
css_transition_basics/
├── README.md
├── sample/
│   ├── index.html / style.css / script.js   ← ステップ1：boxを動かす最小構成
│   └── modal.html / modal.css / modal.js    ← ステップ2：モーダルダイアログ
└── work/
    ├── index.html / style.css / script.js
    └── modal.html / modal.css / modal.js
```

## 学び
（気づきが生まれた時点で都度追記する）

## 関連概念
（セッション終了後に追記）
