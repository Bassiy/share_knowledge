# 静的コンテンツと動的コンテンツ

## 概要
Webサーバーがクライアントに返すコンテンツの生成方式の違い。

## 理解したこと

### 静的 vs 動的

```mermaid
sequenceDiagram
    participant C as クライアント
    participant S as サーバー

    C->>S: リクエスト
    Note over S: 静的：ファイルをそのまま返す
    S-->>C: HTML・画像など

    C->>S: リクエスト
    Note over S: 動的：プログラムが動いて生成する
    S-->>C: 検索結果・ログイン後の画面
```

---

### SSR vs SPA

「どこでHTMLを組み立てるか」の違い。

```mermaid
sequenceDiagram
    participant B as ブラウザ
    participant S as サーバー

    Note over B,S: SSR（ASP.NET MVC等）
    B->>S: リクエスト
    Note over S: サーバーでHTMLを組み立て
    S-->>B: 完成済みHTML

    Note over B,S: SPA（React等）
    B->>S: リクエスト
    S-->>B: JSON（データのみ）
    Note over B: ブラウザ側でHTMLを組み立て
```

---

## 関連概念
- application_layer_protocols（HTTPなどコンテンツを配信するプロトコルが属する層）
- client_server_vs_p2p（静的・動的コンテンツはクライアント/サーバーモデルで配信される）
- url（リクエスト先を特定するための識別子）
- dom（サーバーから受け取ったHTMLをブラウザがDOMとして解釈・構築する）

## ソース
- 2026-05-01：イラスト図解式ネットワークの基本 第5章

## タグ
静的コンテンツ, 動的コンテンツ, Web, サーバー
