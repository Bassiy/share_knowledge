# react_netflix_ui

## 目的
「なんちゃってNetflix画面」を題材に、childrenによるコンポーネント合成と条件付きレンダリングを実践で組み合わせる。
- Row（横スクロールの棚）が中身のカード配列をchildrenとして受け取る、ジャンルを知らない箱として機能するか
- カードのホバー状態を条件付きレンダリングで演出できるか

## 実行方法
`index.html` をブラウザで直接開くだけ。npm installもサーバー起動も不要（React/ReactDOM/BabelはCDNから読み込み、JSXはブラウザ内でBabelがその場変換する）。

## ファイル構成
```
react_netflix_ui/
├── README.md
├── sample/
│   ├── index.html
│   └── app.jsx      # 完成版参考実装（NavBar/Hero/Row/Card一式）
└── work/
    ├── index.html
    └── app.jsx      # 自分で書いた実装（NavBar/Heroまで）
```

## 学び
- `position: relative`（親）＋`position: absolute`（子）の組み合わせで、absoluteの基準点は「一番近いposition:static以外の祖先」になる。その祖先自身がabsoluteでもよく、ネストしたabsolute要素でも同じ規則で成立する
- `inset: 0`は`top/right/bottom/left: 0`のショートハンド
- `background`はカンマ区切りで複数のグラデーションレイヤーを重ねられる。先に書いた方が手前に描画される
- `rgba()`の第4引数（アルファ値）で透明→不透明のフェードを作れる
- `backgroundPosition: "conter"`のような無効な値を渡しても、エラーにはならず黙ってデフォルト値（左上基準）にフォールバックする。無効なCSSプロパティ値は静かに無視される、という点は実装して初めて気づいた
- 当初の目的だったRow/Card（children・条件付きレンダリングの実践）までは手が回らず、NavBar/Heroの見た目調整（CSS）に時間を使うことになった。Row/Card部分は次回に持ち越し

## 関連概念
（持ち越し。Row/Card実装時に react_children・react_conditional_rendering との関連を追記する）
