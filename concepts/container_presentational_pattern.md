# Container/Presentationalパターン

## 概要
データ取得・状態管理を担う「Container」と、表示のみに専念する「Presentational」にコンポーネントを分離するReactの設計パターン。

## 理解したこと

### 実務で見た構成

```
frontend/
└── src/
    ├── Router.js                # URL⇔pages/の対応付け
    │
    ├── pages/                   # 1画面1ファイル、export default。Containerの役割
    │   └── UserPage.jsx         # useEffectでAPIを一括fetch
    │
    ├── components/
    │   ├── ui-elements/         # 状態を持たない最小パーツ（Presentational）
    │   │   └── Button.jsx
    │   └── ui-parts/            # ui-elementsの複合。表示用バリデーション込み
    │       └── UserForm.jsx
    │
    └── hooks/
        └── useApiRequest.js     # 汎用フック
```

---

### 役割分担

| 層 | 役割 | データ取得 |
|---|---|---|
| pages/（Container） | 画面単位。マウント時にAPIを一括取得 | する |
| ui-elements | 状態を持たない最小パーツ | しない（propsで受け取るだけ） |
| ui-parts | ui-elementsの複合＋表示用バリデーション | しない |

```javascript
function UserPage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    useApiRequest('/api/users').then(setUsers);
  }, []);

  return <UserList users={users} />; // データはpropsで渡すだけ
}
```

## 関連概念
- [react_use_effect.md](react_use_effect.md)（Pageマウント時の一括fetchに使われるフックの挙動）
- [n_tier_architecture.md](n_tier_architecture.md)（同じプロジェクトのバックエンド側の構成）

## ソース
- 2026-08-22・会話ベース（実務で見たReactプロジェクトの言語化）

## タグ
React, Container, Presentational, デザインパターン, フロントエンド, useEffect, コンポーネント設計
