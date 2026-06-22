# Flexbox

## 概要
要素を1方向（行または列）に並べるためのCSSレイアウトモード。

`display: flex`を指定した要素は、子要素の挙動が一括で切り替わる。

## 理解したこと

### Flexは1方向、Gridは格子状
Flexは1方向の並べ方、Gridは格子状の配置、という使い分けが一般的。

| | 次元 | 向いている場面 |
|---|---|---|
| Flexbox | 1次元（行 or 列） | ナビバー、カード内の縦積み、中央寄せなど |
| Grid | 2次元（行 and 列） | ギャラリーのような格子状レイアウト |

---

### display: flexは「便利機能」ではなくモード変更
`display: flex`は子要素全部の挙動を切り替える設定であり、無料で安全に付けられる便利オプションではない。

つけた瞬間、直下の子要素は全部flex itemになり、デフォルトの並び方（`flex-direction`の初期値は`row`＝横並び）に切り替わる。縦に積みたい要素に何も考えずに`display: flex`だけ足すと、デフォルトのrow方向によって横並びに崩れる。

```css
.field {
  display: flex;
  flex-direction: column; /* ← rowという初期値を上書きしている */
  gap: 4px;
}
```

---

### justify-contentとalign-items
`justify-content`は主軸（並んでいる方向）、`align-items`は交差軸（直角方向）の揺れを制御する。

`flex-direction: row`なら主軸は横・交差軸は縦。`column`なら逆になる。

```css
body {
  display: flex;
  align-items: center;     /* 交差軸方向の中央寄せ */
  justify-content: center; /* 主軸方向の中央寄せ */
}
```

---

### 同じクラスを複数のdivに繰り返す理由
同じクラスを複数のdivに繰り返すのは、CSSの優先順位（specificity、別概念）の話ではない。

同じクラス＝同じ優先順位なので、複数のdivに同じクラスがついていても競合は起きない。繰り返す理由は構造の話：「label+inputの1組」をdivの境界で明示することで、`gap`（組の中の余白）と`margin-bottom`（組の間の余白）が正しく区別される。1つの巨大なdivに全部まとめると、組の境界がCSSから見えなくなり、`gap`が全要素間に均等にかかってしまう。

---

## 関連概念
- css_box_model（widthの計算がbox-sizingに依存するため、flexアイテムのサイズもその前提を引き継ぐ）

## 関連実装
- [booking_site_vanilla_js](../coding/booking_site_vanilla_js/) — `.field`でのラベル+input1組の縦積み、`body`でのカード全体の中央寄せに使用

## ソース
- 2026-06-22・/codeセッションでの実装・対話から整理

## タグ
CSS, Flexbox, レイアウト, flex-direction, justify-content, align-items
