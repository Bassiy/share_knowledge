# css_transition_basics

## 目的
CSSの`transition`プロパティに絞って、JSがクラスを切り替えた際の見た目の変化を滑らかにする最小構成を試す。
（`classList`操作・`addEventListener`自体はbooking_site_vanilla_jsで経験済みのため、今回は`transition`単体に集中する）

ステップ2として、同じ仕組み（JSがクラス切り替え→CSSのtransitionが補間）をもう少し実務に近いシチュエーション（モーダルダイアログ）に適用し、`display: none`を使うとtransitionが効かないという頻出の落とし穴も確認する。

## 実行方法
ビルドやサーバーは不要。`sample/sample1/index.html`（box移動の最小構成）または`sample/sample2/index.html`（モーダル）をブラウザで直接開くだけで動作確認できる。`work/`側も同様。

## ファイル構成
```
css_transition_basics/
├── README.md
├── sample/
│   ├── sample1/   ← ステップ1：boxを動かす最小構成
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── sample2/   ← ステップ2：モーダルダイアログ
│       ├── index.html
│       ├── style.css
│       └── script.js
└── work/
    ├── sample1/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    └── sample2/
        ├── index.html
        ├── style.css
        └── script.js
```

## 学び

| 誤解・疑問 | 実際 |
|---|---|
| `transition`は「変化後の見た目（`.active`側）」に書けば良い | ブラウザは「変化**後**にマッチするルール」にtransitionがあるかで発火を決める。`.active`側だけに書くと、付く時（後＝`.active`がマッチ）は効くが、外れる時（後＝`#box`だけがマッチ）は効かず瞬間移動になる、という非対称な挙動になる。常に両方の状態でマッチする基本セレクタ（`#box`）側に書くことで、行き帰り対称に効く |
| `display: none ⇄ display: flex`の切り替えにも`transition`を付ければ滑らかになる | `display: none`の間は要素自体がレンダリングされておらず「変化前の値」が存在しないため補間できない。`opacity` + `pointer-events`（常にレンダリングしたまま見えなくする・触れなくする）に置き換えることで回避する |
| `position: fixed`と`inset: 0`は何をしているのか | `position: fixed`が基準位置をビューポート（画面そのもの）に固定し、`inset: 0`（`top/right/bottom/left: 0`の一括指定）がその基準の四辺ぴったりまで広げる。セットで「画面全体を覆う背景」になる |
| `#box.active`のような書き方の名前 | 複合セレクタ（compound selector）。スペース無しで繋ぐと「同じ要素が両方の条件を満たす」(AND)。スペース（`#overlay.open #modal`）は別要素同士の子孫関係、`>`は直接の子だけに絞る子結合子 |
| セレクタとは何か | CSSルールは「セレクタ { 宣言 }」の2部構成。セレクタは「どの要素に当てるか（誰に）」、宣言は「どう変えるか（何を）」を指定する |

## 関連概念
- [css_state_styling](../../concepts/css_state_styling.md) — JSがクラス切り替え、CSSが見た目を一元管理する役割分担の延伸（今回は「見た目」が静的な切り替えではなく`transition`で補間される動きになった）
- [dom](../../concepts/dom.md) — `classList.toggle`・`addEventListener`・HTMLの入れ子=DOMの親子関係の実例（`#overlay`→`#modal`→`#close-btn`）
- [css_transition](../../concepts/css_transition.md) — transitionの発火条件（変化後にマッチするルール基準）とdisplay:noneの罠
- [css_position](../../concepts/css_position.md) — `position: fixed` + `inset: 0`で画面全体を覆う背景を作った
- [css_selector](../../concepts/css_selector.md) — 複合セレクタ・結合子の整理
