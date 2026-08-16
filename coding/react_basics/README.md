# react_basics

## 目的
Reactの基礎を最小構成で触る。
- コンポーネントとprops（親→子へのデータの受け渡し）
- state管理（useStateによる状態管理・再レンダリング）
- 副作用（useEffectによる副作用処理・依存配列・クリーンアップ）

## 実行方法
`index.html` をブラウザで直接開くだけ。npm installもサーバー起動も不要（React/ReactDOM/BabelはCDNから読み込み、JSXはブラウザ内でBabelがその場変換する）。

## ファイル構成
```
react_basics/
├── README.md
├── sample/
│   ├── index.html
│   └── app.jsx      # 完成版参考実装
└── work/
    ├── index.html
    └── app.jsx      # 自分で書いた実装
```

## 学び
- JSXの子要素部分では `//` によるJS行コメントは無効。コメントとして認識されず、そのまま**画面に表示される文字列**になってしまう。JSXの中でコメントを書くときは必ず `{/* ... */}` を使う
- `<span>{count}</span>` のように、要素の中に値を表示するには `{}` で式を埋め込む必要がある。中身を空のままにすると当然何も表示されない（うっかり消しやすいので注意）
- propsは読み取り専用。子コンポーネントは値を書き換えられず、変更したい時は親からもらった関数（`onIncrement`など）を呼んで親のstateを更新してもらう
- `useState`は分割代入で`[現在値, 更新関数]`という配列を受け取る。名前を自由に付けられるのは配列の分割代入（位置ベース）だから
- `useEffect`の第2引数（依存配列）の違い：配列なし＝毎レンダリング実行／`[]`＝初回マウント時のみ／`[値]`＝その値が変わった時だけ
- `useEffect`のreturnで返す関数はクリーンアップ処理。アンマウント時や次のeffect実行前に呼ばれる（`setInterval`の解除など）
- クロージャ：関数は自分が作られた時点の外側の変数を覚え続ける。`useEffect`が`[]`で1回しか実行されない場合、その中で作られたコールバック（`setInterval`など）が古いstateの値を覚えたまま更新し続けてしまう（stale closure）
- 上記の対策が関数型の更新 `setState((prev) => prev + 1)`。値渡し（`setState(count + 1)`）は「その場で計算した確定値」を渡すのに対し、関数型は「計算方法（レシピ）」を渡し、Reactが実行時点の最新値で計算してくれる。同じイベントハンドラ内で`setState`を連続で呼ぶ時（バッチング）にも関数型が安全
- `==` と `===` の違いは動的型付け言語ならではの概念。静的型付け言語では型が固定されているため型変換の要否という概念自体が基本的に存在しない

## 関連概念
- [react_props](../../concepts/react_props.md) - コンポーネントとpropsの受け渡し・読み取り専用の性質
- [react_use_state](../../concepts/react_use_state.md) - useStateの分割代入・値渡しと関数型の更新
- [react_use_effect](../../concepts/react_use_effect.md) - 依存配列とクリーンアップ
- [closure](../../concepts/closure.md) - stale closure問題の土台になっているJavaScriptの基礎概念
