# SOLID原則

## 概要
ソフトウェア設計の5つの原則。「設計の理想」として、複雑になってきたと感じたときに違反していないか確認する道具。

## 理解したこと

| 原則 | 正式名 | 一言（自分の言葉） |
|--|--|--|
| S | 単一責任（SRP） | 修正時の影響範囲を最小限にするための、クラスの切り分けの話 |
| O | 開放閉鎖（OCP） | 最小限の変更で拡張できるようにしろ（目的）。実現手段はDが担う |
| L | リスコフ置換（LSP） | 拡張ではなく塗り替えをするな。Is-a でも使い方の約束を守れ |
| I | インターフェース分離（ISP） | インターフェースは細切れにしろ。盛り込んだら具体クラスと変わらん |
| D | 依存性逆転（DIP） | プロパティの型をクラス型ではなくインターフェース型にして、柔軟に付け替えられるようにしろ |

- 最初から完璧に適用しなくていい
- 「なんか関数が複雑になってきたな」と感じたときに参照する

### OCPとDIPの関係
似ているが焦点が異なる。

| | 何の話か | 焦点 |
|---|---|---|
| OCP | 設計の目標 | 既存コードを変えずに拡張できる状態にしろ |
| DIP | 依存の方向 | 具体ではなく抽象に依存しろ |

DIP は OCP を実現するための手段の1つ。「インターフェース型で持つ（DIP）」をやった結果として「新しい実装を追加しても既存コードを変えなくていい（OCP）」が手に入る。

### SRPの本質：「長時間露光で見る原則」
よくある誤解は「1クラス1機能」という静止画的な解釈。
本来のSRPは「**クラスを変更する理由は1つでなければならない**」（Uncle Bob）。

- 「何をするか（機能）」ではなく「**誰が変更を要求してくるか（アクター）**」で責務を判断する
- 時間軸で「このクラスに変更を要求してくる人・部門が何種類いるか」を見ると責務の混在が見えてくる

```
OrderService の例
  ビジネス部門（アクター1）→ 受注ルールを変えたい
  マーケ部門  （アクター2）→ メール文面を変えたい
  経理部門    （アクター3）→ 帳票フォーマットを変えたい
  → アクターが3つ = SRP違反 → 3クラスに分離する
```

- 「機能の数」で分割するのではなく「変更を要求してくる人の種類」で分割する
- CQRSのCommand/Query分離もSRPで正当化できる（変更理由が違う）

### OCPの本質：拡張に開いて、修正に閉じる
新しい機能を追加するとき、既存コードを変えなくていい状態にしろという原則。

```csharp
// Laser を追加しても Turret も foreach も変えなくていい
class Laser : IAttackable {
    public void Attack() { Console.WriteLine("レーザー発射！"); }
}
new Turret(new Laser());
```

OCPはあくまで「こういう状態を目指せ」という考え方であり、具体的にどう実現するかはDIP（抽象に依存しろ）が担う。

### LSPの本質：約束を守れ
子クラスは親クラスの代わりに使っても壊れてはいけない。Is-a の関係があっても、呼び出し側の期待まで守れていなければLSP違反。

```csharp
Rectangle r = new Square();
r.Width = 4;
r.Height = 5;
Console.WriteLine(r.Area());  // 20 を期待 → 25 が返る（塗り替えが起きている）
```

Square は数学的には Rectangle の一種だが、Width を変えると Height も変わるという**親にはなかったルールを上書き**してしまった。継承の本来の目的は「拡張」であり、「塗り替え」ではない。

### ISPの本質：インターフェースは細切れにしろ
使わないメソッドを実装させるな。盛り込みすぎたインターフェースは具体クラスと変わらない。

```csharp
// ❌ 太りすぎ
interface IWorker { void Work(); void Eat(); void Sleep(); }
class Robot : IWorker {
    public void Work() { ... }
    public void Eat() { throw new NotImplementedException(); }
    public void Sleep() { throw new NotImplementedException(); }
}

// ✅ 細切れにする
interface IWorkable { void Work(); }
class Robot : IWorkable { public void Work() { ... } }
```

### DIPの本質：抽象に依存しろ
プロパティの型をクラス型ではなくインターフェース型にすることで、上位が下位の具体を知らなくていい状態にする。

```csharp
// ❌ 具体に依存
private Sword _weapon;

// ✅ 抽象に依存
private readonly IAttackable _attacker;
```

**依存の方向：**
```
上位 → 抽象（インターフェース） ← 具体実装A
                               ← 具体実装B
```
上位と具体の両方が抽象を向く。これが「逆転」という名前の由来。

**テスト文脈での強み：**
インターフェース型で受け取る設計にしておくと、本番用オブジェクトとフェイク（テスト用の簡易実装）を自由に差し替えられる。

```csharp
// 本番
var service = new OrderService(new EmailNotifier());
// テスト（メールが飛ばない）
var service = new OrderService(new FakeNotifier());
```

## 関連概念
- composition（OCPとDIPの実現手段）
- oop_interface（ISPとDIPの土台）
- state_vs_property.md（SRPの具体例）
- separation_of_concerns.md（SRPの基盤となる考え方）
- cqrs.md（SRPの観点でCommand/Query分離を正当化できる）

## ソース
- 2026-03-06・会話から
- 2026-03-17・会話から（SRPのアクターベース理解を追記）
- 2026-05-30・会話から（O・L・I・D の深掘りを追記）

## タグ
設計原則, SOLID, オブジェクト指向, ソフトウェア設計
