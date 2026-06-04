using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // ❌ 誤解しやすい：ISpeakable 型の変数に Dog インスタンスは代入できない
        // ✅ 正しくは：できる。変数の型が ISpeakable なだけで、実体は Dog のまま
        //    ISpeakable dog = new Dog(); → 型: ISpeakable、実体: Dog
        //    Dog dog        = new Dog(); → 型: Dog、       実体: Dog
        //    同じ実体でも、型が違うだけで見えるメソッドが変わる

        // 「実装する」と「型として使う」は別の話
        // 実装する  → クラスが「この型の仲間です」と登録する行為（作る側）
        // 型として使う → 「仲間ならまとめて扱える入れ物」を作る行為（使う側）
        // この2つが揃って初めてポリモーフィズムが成立する

        // ISpeakable を実装している → Dog・Cat・Robot 全員が入れる
        // Dog と Robot は継承関係なし。ISpeakable という横のつながりだけで同じリストに入る
        List<ISpeakable> animals = new List<ISpeakable> { new Dog(), new Cat(), new Robot() };

        // 通常の書き方（同じ意味）
        // List<ISpeakable> animals = new List<ISpeakable>();
        // animals.Add(new Dog());
        // animals.Add(new Cat());
        // animals.Add(new Robot());

        foreach (var animal in animals)
        {
            // animal の型は ISpeakable なので Speak() しか呼べない
            // 実体が Dog でも Fetch() は見えない（型で見える範囲が決まる）
            animal.Speak();
        }

        Console.WriteLine("---");

        // IRunnable を実装しているのは Dog と Robot だけ → Cat は入れられない
        // Dog と Robot は血縁なし。IRunnable という横のつながりだけで同じリストに入る
        List<IRunnable> runners = new List<IRunnable> { new Dog(), new Robot() };
        foreach (var runner in runners)
        {
            runner.Run();
        }
    }
}
