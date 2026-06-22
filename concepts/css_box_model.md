# CSSボックスモデル

## 概要
HTML要素は content・padding・border・marginの4層構造を持つ。

`box-sizing`は`width`/`height`がその層のどこまでを含むかを決める。

## 理解したこと

### 4層構造
要素の見た目は「コンテンツ → パディング（内側余白） → ボーダー（境界線） → マージン（外側余白）」の4層が外側に向かって積み重なってできている。

| 層（外側から） | 役割 |
|---|---|
| margin | 要素の外側の余白 |
| border | 境界線 |
| padding | 内側の余白 |
| content | 実際の内容（テキスト・画像） |

borderは太さ・スタイル・色の3つを指定できる（`border-width`・`border-style`・`border-color`、一括指定は`border: 太さ スタイル 色;`の順）。padding・marginは1〜4個の値で上下左右を指定する。

---

### box-sizingがwidthの意味を変える
デフォルト（`content-box`）では`width`はcontentだけのサイズを指し、padding・borderはその外側に追加される。

`border-box`は`width`にpadding・borderを含めるため、指定した幅から要素がはみ出さない。

| box-sizing | widthが指す範囲 | padding/borderの扱い |
|---|---|---|
| `content-box`（デフォルト） | contentのみ | widthの外側に追加される |
| `border-box` | content + padding + border | widthの内側に収まる |

```css
* {
  box-sizing: border-box;
}
```

全要素に`border-box`を一括適用しておくのが実用上の定石。これをしないと、`width: 100%`にpaddingやborderを追加した要素が親からはみ出す。

---

## 関連概念
- css_flexbox（widthの計算がbox-sizingに依存する点で、レイアウト全体の前提になる）

## 関連実装
- [booking_site_vanilla_js](../coding/booking_site_vanilla_js/) — input要素にwidth:100%+padding+borderを指定しつつ、box-sizing: border-boxで親要素からはみ出さないことを確認した

## ソース
- 2026-06-22・Qiita「CSSのボックスモデル」https://qiita.com/thirai67/items/647a96801082c273e188   （content/padding/border/marginの4層構造の説明）
- 2026-06-22・/codeセッションでの実装・対話から整理（box-sizing自体）

## タグ
CSS, ボックスモデル, box-sizing, レイアウト, padding, border, margin
