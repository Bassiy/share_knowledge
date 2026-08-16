# React children

## 概要
親コンポーネントがタグの間に書いたJSXを、子コンポーネント側が`props.children`として受け取れる仕組み。中身が何であるかを子が知らなくても「箱」として機能させられる。

## 理解したこと

### タグの間に書いたJSXがそのまま`props.children`になる
`<Panel title="...">中身</Panel>`と書いた時の「中身」は、`children`という名前の特別なpropとして`Panel`に渡っている。`<Panel title="..." children={...} />`と明示的に書くのと本質的に同じで、タグの間に書けるのはただの糖衣構文。

```jsx
function Panel({ title, children }) {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

<Panel title="見出し">
  <p>ここがchildren</p>
</Panel>
```

---

### childrenの中身が何であるかを、受け取る側は関知しない
`Panel`のような合成用コンポーネントは、渡された中身がプレーンテキストかネストした別のコンポーネントかを一切気にせず、そのまま描画するだけ。この「中身を知らない箱」としての性質が、レイアウト用コンポーネント（Modal, Cardなど）を汎用的に再利用可能にする土台になる。

## 関連概念
- react_props（childrenはpropsの一種。ただし名前が予約されており、タグの間に書くと自動でこの名前に入る点が通常のpropsと異なる）

## 関連実装
- [react_conditional_children](../coding/react_conditional_children/) — Panelコンポーネントでテキスト/別コンポーネント/条件付き要素をchildrenとして渡し、挙動を確認した

## ソース
- 2026-08-11・/codeセッションでの実装・対話から整理

## タグ
React, children, コンポーネント合成, composition
