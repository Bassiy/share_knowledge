# React props

## 概要
親コンポーネントから子コンポーネントへ、読み取り専用のデータを渡す仕組み。関数の引数のように受け取る。

## 理解したこと

### propsは分割代入で受け取る関数の引数
JSXでは通常のHTMLタグに加え、自作のコンポーネントをタグとして使える。propsは呼び出し側が渡した値の集まりで、オブジェクトの分割代入で受け取るのが一般的。

```jsx
function Message({ count }) {
  return <p>現在の値は{count}</p>;
}

<Message count={5} />
```

---

### propsは読み取り専用
子コンポーネントはpropsを直接書き換えられない。値を変更したい場合、子は親から渡された関数（コールバック）を呼び出すだけで、実際のデータ更新は親側（stateを持つ側）が担う。

| 誰が | 何をする |
|---|---|
| 親 | stateを持ち、更新用の関数（`handleIncrement`など）を定義する |
| 親 | その関数をpropsとして子に渡す |
| 子 | 受け取った関数をイベントに紐づけて呼び出すだけ。値そのものは変更しない |

```jsx
function App() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => setCount((prev) => prev + 1);

  return <Counter count={count} onIncrement={handleIncrement} />;
}

function Counter({ count, onIncrement }) {
  return <button onClick={onIncrement}>{count}</button>;
}
```

---

### props名は自由、ただし`onXxx`は慣習
ネイティブのDOM要素（`<button onClick={...}>`）が持つ`onClick`は、Reactが「クリックイベントの処理」として意味を知っている組み込みのprop名。一方、自作コンポーネントの`onIncrement`のような名前は完全に開発者が決めた任意の名前で、`on`から始める命名はネイティブ要素の慣習に合わせた「これはイベントハンドラです」という意図表示に過ぎない。

## 関連概念
- react_use_state（propsとして渡される値・関数の実体はuseStateで管理されるstateとその更新関数）

## 関連実装
- [react_basics](../coding/react_basics/) — Message/Counterコンポーネントでpropsの受け渡しと読み取り専用の性質を確認した

## ソース
- 2026-08-02・/codeセッションでの実装・対話から整理

## タグ
React, JSX, props, コンポーネント, 一方向データフロー
