# CSS transition

## 概要
CSSプロパティの値が変化するとき、瞬時の切り替えではなく指定した時間をかけて滑らかに補間するためのプロパティ。

## 理解したこと

### 発火するかどうかは「変化後にマッチするルール」で決まる
ブラウザは、プロパティの値が変わった**後**の状態にどのCSSルールが当たっているかを見て、そこに`transition`が書かれているかどうかでアニメーションを発火させるかを決める。

「変化前のルールにtransitionがあるか」ではなく「変化後のルールにtransitionがあるか」が判定基準。

```css
#box {
  transition: transform 0.4s ease; /* ← 両方の状態で常にマッチするここに書く */
}

#box.active {
  transform: translateX(300px);
}
```

| transitionの記述場所 | `.active`が付く時（後＝`#box.active`） | `.active`が外れる時（後＝`#box`のみ） |
|---|---|---|
| 基本セレクタ（`#box`）側 | 効く | 効く（対称） |
| 修飾クラス（`.active`）側のみ | 効く | 効かない・瞬間移動（非対称） |

両方向で対称に効かせたいなら、常にマッチし続ける基本セレクタ側に書く。

---

### display: noneでは効かない
`transition`は「変化前の値」から「変化後の値」へ補間する仕組み。

`display: none`の間、要素はレンダリングされていないため、補間する「変化前の値」自体が存在しない。

| アプローチ | レンダリングされ続けるか | transitionが効くか |
|---|---|---|
| `display: none ⇄ block/flex` | されない（非表示中は消える） | 効かない |
| `opacity: 0 ⇄ 1` | される（透明なだけ） | 効く |

```css
#overlay {
  opacity: 0;
  pointer-events: none; /* これ自体はtransitionしないが、opacity:0で見えないため問題ない */
  transition: opacity 0.3s ease;
}

#overlay.open {
  opacity: 1;
  pointer-events: auto;
}
```

回避策は、表示/非表示を`display`ではなく`opacity`で表現すること。

クリックを透過させたい場合は`pointer-events: none`を別途組み合わせる。

---

## 関連概念
- css_state_styling（JSがクラスを付け外し、CSSが見た目を定義するという役割分担の上に、transitionが「変化の補間」を追加する）
- dom（classList.toggleでクラスを切り替えるJS側の操作。transitionはその結果に対するCSS側の反応）

## 関連実装
- [css_transition_basics](../coding/css_transition_basics/) — box移動とモーダルダイアログの2パターンで、transitionの記述位置とdisplay:noneの罠を確認した

## ソース
- 2026-06-25・/codeセッションでの実装・対話から整理

## タグ
CSS, transition, アニメーション, display, opacity, pointer-events
