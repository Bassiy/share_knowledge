# csharp_interface

## 目的
C# におけるインターフェースの理解。インターフェースを型として扱うことで何が嬉しいかを体感する。

## やったこと
- ISpeakable・IRunnable の2つのインターフェースを定義し、Dog・Cat・Robot に実装
- `List<ISpeakable>` に異なるクラスをまとめて入れて foreach で動かした
- `ISpeakable` 型の変数から `Dog` 固有の `Fetch()` を呼ぼうとしてコンパイルエラーを確認（型で見える範囲が決まる）
- 実装は override ではなく「約束の中身を初めて書く」ことだと整理
- `IAnimal` という命名がスーパークラスっぽいと気づき `ISpeakable` に改名
