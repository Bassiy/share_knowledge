# react_conditional_children

## 目的
条件付きレンダリング（`&&`・三項演算子でのUI出し分け）と、childrenによるコンポーネント合成（JSXを子として渡すパターン）を試す。

## 実行方法
`index.html` をブラウザで直接開くだけ。npm installもサーバー起動も不要（React/ReactDOM/BabelはCDNから読み込み、JSXはブラウザ内でBabelがその場変換する）。

## ファイル構成
```
react_conditional_children/
├── README.md
├── sample/
│   ├── index.html
│   └── app.jsx      # 完成版参考実装
└── work/
    ├── index.html
    └── app.jsx      # 自分で書いた実装
```

## 学び
- `条件 && 処理` は「trueなら実行して結果を返す」という手続き的なものではなく、**式の評価**。条件がtrueなら右辺（処理側）の評価結果を返し、falseなら左辺（条件の値そのもの）を返すだけ
- falseの場合に返るのは`false`自体で、Reactは`false`/`null`/`undefined`を「何も描画しない」として扱う。ただし`0`や`""`はこの特別扱いの対象外なので、`count && <span>...</span>`は`count`が`0`の時に画面へ`0`がそのまま表示されてしまう（`count > 0 && ...`のように明示的にboolean化するのが正しい書き方）
- JSXの開始/終了タグは名前が完全一致していないとパースエラーになる（`<buttom>`と`</button>`のような1文字違いのタイポでもビルドごと落ちる）
- `<Panel title="...">中身</Panel>`の「中身」は`props.children`として渡っているだけ。`children={...}`を明示的に書くのと本質的に同じで、タグの間に書けるのはただの糖衣構文。Panel側は中身がテキストか別のコンポーネントかを一切知らない・関知しない

## 関連概念
- [react_conditional_rendering](../../concepts/react_conditional_rendering.md) — 三項演算子/`&&`の使い分け・`&&`の0の落とし穴
- [react_children](../../concepts/react_children.md) — Panelコンポーネントによるchildren合成
- [react_props](../../concepts/react_props.md) — childrenはpropsの一種という位置づけ
