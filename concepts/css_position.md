# CSS position（position: fixed）

## 概要
`position`は要素の配置の基準点を変えるCSSプロパティ。

`position: fixed`はビューポート（画面そのもの）を基準にし、スクロールしても同じ位置に留まる。

## 理解したこと

### position: fixedの基準はビューポート
`position: fixed`を指定すると、要素は通常の配置の流れ（他の要素との並び）から外れる。

代わりにビューポートを基準位置にして配置され、ページをスクロールしてもビューポート上の同じ位置に留まり続ける。

モーダルの背景（オーバーレイ）のように「画面全体を覆う」UIに使われる。

---

### insetはtop/right/bottom/leftの一括指定
`inset: 0`は`top: 0; right: 0; bottom: 0; left: 0;`をまとめて指定するショートハンド。

基準位置（`position`で決まる）の四辺ぴったりまで要素を広げる。

```css
#overlay {
  position: fixed;
  inset: 0; /* ビューポート全体を覆う */
}
```

`position`が基準を決め、`inset`がそこからの距離を決める、という役割分担。

`position`が無いと（`static`のままだと）`inset`は基準点が定まらず無視される。

---

## 関連概念
- css_box_model（要素ひとつひとつがcontent/padding/border/marginの4層boxを持つという前提の上に、positionはそのboxを「どこに置くか」を決める）

## 関連実装
- [css_transition_basics](../coding/css_transition_basics/) — モーダルダイアログの背景（`#overlay`）を画面全体に固定するために使用

## ソース
- 2026-06-25・/codeセッションでの実装・対話から整理

## タグ
CSS, position, fixed, inset, レイアウト, ビューポート
