# booking_site_vanilla_js

## 目的
HTML / CSS / JavaScript（フレームワークなし）だけで、1画面の予約フォームを実装する。
日付・時間・名前・メールを入力して予約し、送信後に確認表示を出すところまでをスコープとする。
レイアウト・デザインの基本的な考え方と、JavaScript（DOM操作・イベント処理）の基礎をJS初心者向けに体感することが目的。

## 実行方法
ビルドやサーバーは不要。`sample/index.html` または `work/index.html` をブラウザで直接開くだけで動作確認できる（`open sample/index.html` など）。

## ファイル構成
```
booking_site_vanilla_js/
├── README.md
├── sample/        ← Claudeが書いた完成版の参考実装
│   ├── index.html
│   ├── style.css
│   └── script.js
└── work/          ← 自分で書く場所（空ファイル）
    ├── index.html
    ├── style.css
    └── script.js
```

## 学び

| 誤解・疑問 | 実際 |
|---|---|
| `required` はJSが無いと効かない | ブラウザ標準機能。空欄submitをJS無しでブロックし、標準エラー表示を出す |
| `name` と `id` は同じようなもの | `id`はページ内で一意の識別子（CSS/JS/labelのfor用）、`name`はフォーム送信時のキー名。役割が違う |
| `box-sizing: border-box` の意味 | デフォルト（`content-box`）は`width`が中身だけのサイズで、padding/borderはその外側に追加される。`border-box`は`width`にpadding/borderを含めるため、`width: 100%`を指定しても親要素からはみ出さない |
| `<input for="text" ...>` のように `for` をinputに書いてしまう | `for`はlabel側の属性（紐づけ先のid指定用）。input自体の種類を指定するのは`type`属性。抜けるとデフォルトのテキスト入力になり、`type="email"`等の検証・専用キーボードが効かない |
| Flexは1方向配置だから雑につけても害がない | `display: flex`は子要素全部の挙動を切り替えるモード変更で、無料の便利機能ではない。`flex-direction`の初期値は`row`なので、何も考えずに付けると縦積みのつもりが横並びに崩れる（`.field`で`flex-direction: column`を明示しているのはその上書き） |
| `:focus`/`:hover` って何 | 状態に応じて見た目を変える疑似クラス。`:hover`はマウスが乗っている間、`:focus`はキーボード/クリックでその要素が選択されている間に適用される。JS無しで状態に応じたスタイル変更ができる |
| `outline: none` だけで終わらせる | デフォルトのフォーカスリングを消すと、キーボード操作者がどこにフォーカスがあるか見えなくなる典型的なアクセシビリティの落とし穴。`outline: none`するなら必ず別の視覚的フィードバック（今回は`border-color`）をセットで用意する |
| C#の`foreach`とJSの`.forEach()`は同じもの | `foreach`は言語構文（`if`/`while`の仲間）。`.forEach()`は配列のメソッドへの関数呼び出しで、構文的には別物。C#の`foreach`に直接対応するのはJSの`for...of`。`.forEach()`の中では`break`が使えない |

- `class="confirmation hidden"` は2クラス同時付与。`.confirmation`が見た目、`.hidden`が`display: none`を担当し、プロパティが重複しないのでそのまま両方効く
- `confirmation.classList.remove('hidden')` はJSが`hidden`という状態フラグを外すだけで、見た目（`display: none`の中身）はCSS側が一元管理している。JSに直接`element.style.display = ...`を書かせないことで、見た目の定義を1箇所（CSS）に保てる
- JSのDOM操作（`classList.remove`・`textContent`書き換え・`form.reset()`など）が変更するのは、ブラウザがメモリ上に持つDOMツリーだけ。`work/index.html`というファイル自体は書き換わらないため、リロードするとファイルから新しくDOMが作られ直し、hiddenの初期状態に戻る
- 状態クラスの付け外しには2種類ある：ブラウザが元から知っている状態（`:hover`・`:focus`・`:invalid`など。JS不要）と、アプリ側で発明した状態（タブの`active`・予約確認の`hidden`。ブラウザはその概念を知らないのでJSでクラスを付け外すしかない）
- `error`は両方の合わせ技：有効かどうかの判定自体はブラウザのネイティブ検証（`invalid`イベント）に任せ、見た目だけ自前の`.error`クラスに差し替えている。ネイティブの吹き出しUIはCSSでデザインを変えられないため
- JSの実行は2層に分かれる：「上から下に1回だけ動く準備コード」（`forEach`でのリスナー登録など。ページ読み込み時に一瞬で完了）と「イベントが起きた時だけ呼ばれるコールバック」（登録時点では実行されず、ブラウザが該当イベントを検知するたびに呼ばれる）。これがイベント駆動（event-driven）という動き方
- 「関数を渡す」こと自体に「後で呼ばれる」という意味はない。`.forEach()`に渡したコールバックはその行の実行中に即座に・同期的に呼ばれるが、`addEventListener`に渡したコールバックは実際にイベントが起きるまで呼ばれない。いつ呼ばれるかは渡した先の関数の仕様で決まる

- `sample/script.js` では `document.getElementById()` で値取得しているため、`name` 属性は今のJSコードでは実質未使用。将来のサーバー送信や `FormData` 利用、ブラウザの自動入力のために書いている

## 関連概念
- [dom](../../concepts/dom.md) — JSが操作するのはメモリ上のDOMで、HTMLファイル自体は不変という実例。addEventListenerの登録と実行タイミングの分離も
- [separation_of_concerns](../../concepts/separation_of_concerns.md) — JSがクラスの付け外しだけを担い、見た目の定義はCSSに一元化する実例
- [css_box_model](../../concepts/css_box_model.md) — box-sizingでwidthの計算範囲を変える仕組み
- [css_flexbox](../../concepts/css_flexbox.md) — 1方向レイアウトとflex-directionの初期値の罠
- [css_state_styling](../../concepts/css_state_styling.md) — 疑似クラス（ブラウザ標準）とJSで付け外すクラスの2種類、errorはその合わせ技
- [html_forms](../../concepts/html_forms.md) — label/for、id/nameの役割の違い、required/typeのネイティブ検証
