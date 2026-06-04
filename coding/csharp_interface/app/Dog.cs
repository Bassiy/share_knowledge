using System;

// 複数のインターフェースを実装できる（継承は1つだけだが、インターフェースは何個でもOK）
// ISpeakable と IRunnable、両方の「仲間」として登録される
class Dog : ISpeakable, IRunnable
{
    // 省略形
    public void Speak() => Console.WriteLine("ワン！");

    // 通常の書き方（同じ意味）
    // public void Speak()
    // {
    //     Console.WriteLine("ワン！");
    // }

    // ↓ これは実装（override）ではない。ISpeakableに中身がないので「初めて書く」
    // override = 親クラスにある実装を上書き
    // 実装   = 約束（インターフェース）の中身を初めて自分で書く

    // Fetch は Dog 固有のメソッド。ISpeakable型の変数からは見えない（型で見える範囲が決まる）
    public void Fetch() => Console.WriteLine("ボールを取ってきた！");
    public void Run() => Console.WriteLine("犬が走った！");
}
