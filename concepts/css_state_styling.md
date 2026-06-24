# 状態に応じたCSSスタイリング

## 概要
要素の状態に応じて見た目を変える方法には、ブラウザが標準で判定する疑似クラスと、JSでクラスを付け外す自作の状態クラスの2種類がある。

## 理解したこと

### ブラウザが知っている状態：疑似クラス
`:hover`・`:focus`・`:invalid`などの疑似クラスは、要素の今の状態に応じてブラウザ自身が自動で付け外しする。

JS不要で状態に応じたスタイル変更ができる。

| 疑似クラス | 適用される状態 |
|---|---|
| `:hover` | マウスポインタが乗っている間 |
| `:focus` | キーボード/クリックでその要素が選択されている間 |
| `:invalid` | inputの値が`required`・`type`などのvalidation属性を満たしていない間 |

```css
input:focus {
  outline: none;       /* デフォルトのフォーカスリングを消す */
  border-color: #4a90d9;
}
```

`outline: none`だけで終わらせると、キーボード操作者がどこにフォーカスがあるか見えなくなる。`outline: none`するなら必ず別の視覚的フィードバック（`border-color`の変化など）をセットで用意する。

---

### ブラウザが知らない状態：JSで付け外すクラス
「タブのどれが選ばれているか」「予約確認メッセージを表示するか」のような、ブラウザが概念自体を知らない状態は、JSがクラスを付け外して管理するしかない。

JSとCSSで役割分担している。

| クラス例 | 何の状態か |
|---|---|
| `hidden` | 要素の表示/非表示 |
| `active` | ナビのどのタブが選ばれているか |
| `error` | 入力エラー時に赤くする |

```js
confirmation.classList.remove('hidden');
```

JSが担うのは「`hidden`という状態フラグを外す」操作だけ。見た目（`display: none`の中身）の定義はCSS側に一元化されていて、JSに直接`element.style.display = ...`を書かせない。見た目の定義を1箇所（CSS）に保てる。

---

### errorは両方の合わせ技
有効かどうかの判定自体はブラウザのネイティブ検証（`invalid`イベント）に任せ、見た目だけ自前の`error`クラスに差し替える、という組み方ができる。

ネイティブの検証結果（吹き出しUI）はCSSでデザインを変更できないため。

```js
field.addEventListener('invalid', (event) => {
  event.preventDefault(); // ネイティブの吹き出しUIを止める
  field.classList.add('error');
});

field.addEventListener('input', () => {
  field.classList.remove('error'); // 打ち直したらリセット
});
```

```css
input.error {
  border-color: #e0544c;
}
```

`:invalid`を直接CSSで使わない理由は、ページを開いた瞬間（まだ何も入力していない時点）から空欄の必須項目に効いてしまうため。`.error`はJSが「実際にsubmitして判定された後」だけ付けるので、最初から赤くならない。

---

## 関連概念
- separation_of_concerns（JSが状態管理、CSSが見た目定義という役割分担の具体例）
- dom（`classList`操作やイベントリスナーの仕組み自体はDOM APIの一部）
- html_forms（ネイティブ検証`required`・`type`の見た目をカスタマイズする具体的な適用先）

## 関連実装
- [booking_site_vanilla_js](../coding/booking_site_vanilla_js/) — hidden（確認表示）とerror（入力検証）の両方を実装して比較した

## ソース
- 2026-06-22・/codeセッションでの実装・対話から整理

## タグ
CSS, 疑似クラス, hover, focus, invalid, JavaScript, classList, 状態管理
