# HTMLフォーム

## 概要
`<form>`内の各入力要素は、`id`（一意な識別子）と`name`（送信時のキー名）という別の役割を持つ属性と、JS無しで効く標準検証機能を持つ。

## 理解したこと

### labelとinputの紐づけ
`<label for="...">`と`<input id="...">`が一致しているとき、labelはそのinputに紐づく。

見た目の近さでは紐づかない。この紐づきにより、labelをクリックすると対応するinputにフォーカスが当たる。

```html
<label for="date">日付</label>
<input type="date" id="date" name="date" required>
```

---

### idとnameは別の役割
`id`はページ内で一意な識別子、`name`はフォーム送信時のキー名。見た目が同じ値になりがちだが役割が違う。

| 属性 | 役割 | 使われる場所 |
|---|---|---|
| `id` | ページ内で一意な識別子 | CSSの`#セレクタ`、`document.getElementById()`、`<label for="...">` |
| `name` | フォーム送信時のキー名 | サーバー送信、`FormData`、ブラウザの自動入力 |

`id`は1ページ内で重複NG。`name`は逆に、ラジオボタンのグループなどで複数要素が同じ値を共有することもある（同じ選択肢グループだとブラウザに伝えるため）。

`document.getElementById()`で値を取得するJSコードでは、`name`属性は実質未使用になる。それでも書く理由は、将来のサーバー送信や`FormData`利用、ブラウザの自動入力のため。

---

### requiredとtypeはJS無しで効く
`required`や`type="email"`のような属性は、JSを書かなくてもブラウザが標準の検証をしてくれる。

空欄submitをブロックし、標準のエラー表示（吹き出し）を出す。

`type`属性はinputの種類を指定する。`for`属性と紛れやすいが、`for`はlabel側の属性で紐づけ先のidを指定するものであり、inputの種類とは無関係。`type`が抜けるとデフォルトのテキスト入力になり、専用キーボードや検証が効かない。

ネイティブ検証結果の見た目をカスタマイズする組み方は css_state_styling を参照。

---

## 関連概念
- css_state_styling（ネイティブ検証`:invalid`/`invalid`イベントを自前の`error`クラスに変換する具体的な仕組み）

## 関連実装
- [booking_site_vanilla_js](../coding/booking_site_vanilla_js/) — 日付・時間・名前・メールの4フィールドで実装した

## ソース
- 2026-06-22・/codeセッションでの実装・対話から整理

## タグ
HTML, フォーム, label, id, name, required, バリデーション
