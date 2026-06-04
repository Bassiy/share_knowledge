# csharp_interface

## 目的
C# におけるインターフェースの理解。インターフェースを型として扱うことで何が嬉しいかを体感する。

## ファイル構成
```
csharp_interface/
├── README.md
└── app/
    ├── ISpeakable.cs   ← インターフェース定義（Speakできることの約束）
    ├── IRunnable.cs    ← インターフェース定義（Runできることの約束）
    ├── Dog.cs          ← ISpeakable, IRunnable を実装
    ├── Cat.cs          ← ISpeakable のみ実装
    ├── Robot.cs        ← ISpeakable, IRunnable を実装（Dogと血縁なし）
    ├── Program.cs      ← エントリポイント
    └── app.csproj
```

## 学び
- ISpeakable・IRunnable の2つのインターフェースを定義し、Dog・Cat・Robot に実装
- `List<ISpeakable>` に継承関係のないクラスをまとめて入れられることを確認（横のつながり）
- `ISpeakable` 型の変数から `Dog` 固有の `Fetch()` を呼ぶとコンパイルエラー → 型で見える範囲が決まる
- ❌ 誤解：インターフェースの実装 = override（親の実装を上書き）→ ✅ 中身のない約束を初めて自分で書く
- ❌ 誤解：`IAnimal` のような名詞形の命名でOK → ✅ Can-do を表す `I + 動詞able`（ISpeakable）が慣習
- ❌ 誤解：`ISpeakable dog = new Dog()` という書き方はできない → ✅ できる。型が ISpeakable なだけで実体は Dog

## 関連concept
- [oop_interface.md](../../concepts/oop_interface.md) — このセッションで体感した概念の本体
- [polymorphism.md](../../concepts/polymorphism.md) — インターフェースが実現する「実体によって振る舞いが変わる」仕組み
