# react_todo_app

## 目的
ToDoリストアプリを題材に、propsとuseState/useEffectの上に積み上がる次の3つを触る。
- リストレンダリング（`.map`とkeyの役割）
- フォーム制御（controlled componentsによる入力管理）
- useRef（再レンダリングを起こさない値の保持・DOM要素への直接アクセス）

## 実行方法
`index.html` をブラウザで直接開くだけ。npm installもサーバー起動も不要（React/ReactDOM/BabelはCDNから読み込み、JSXはブラウザ内でBabelがその場変換する）。

## ファイル構成
```
react_todo_app/
├── README.md
├── sample/
│   ├── index.html
│   └── app.jsx      # 完成版参考実装
└── work/
    ├── index.html
    └── app.jsx      # 自分で書いた実装
```

## 学び
- controlled componentは`value`と`onChange`をセットで渡さない限り、Reactが入力を上書きし続けてしまい文字が打てない状態になる
- チェックボックスは`onClick`でも`e.target.checked`が既にトグル後の値になっているため動作するが、controlled componentとしての慣習は`onChange`に統一するのが一般的
- `useRef(初期値)`は`{ current: 初期値 }`という1プロパティだけのオブジェクトを返しているだけ。`.current`というキー名は固定、`inputRef`などの変数名は自由につけられる
- useStateとuseRefの本質的な違いは「値を保持できるかどうか」ではない。どちらも値は保持される（後述のインスタンスの記憶領域に置かれているため）。違うのは「値の変更が再レンダリングの引き金になるかどうか」。`ref.current = x`はただのプロパティ代入でReactに何も通知しないため、再描画が起きない
- コンポーネント関数は再レンダリングのたびに毎回最初から再実行される。ただしReactは裏側で「インスタンス」を保持しており、hookの値（useState/useRef）はそのインスタンス側に置かれているため、関数が何度呼び直されても値は消えない
- 値がリセットされるのはマウント（インスタンス新規作成）／アンマウント（インスタンス破棄）のタイミングだけ。再レンダリングでは何もリセットされない
- keyにindexを使うと、配列の要素が削除/追加されてindexの対応がズレても、Reactはそれに気づけず古いDOMノード（とその中のinputの入力内容）をそのまま次の要素に使い回してしまう

## 関連概念
- [react_props](../../concepts/react_props.md) - propsの受け渡し・読み取り専用の性質
- [react_use_state](../../concepts/react_use_state.md) - useStateの分割代入・値渡しと関数型の更新
- [react_use_effect](../../concepts/react_use_effect.md) - 依存配列とクリーンアップ
- [react_use_ref](../../concepts/react_use_ref.md) - レンダリングを跨いだ値の保持・再レンダリングを起こさない性質・DOM要素への直接アクセス
- [react_key](../../concepts/react_key.md) - indexをkeyにすると起きる対応ズレの罠
