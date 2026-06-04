using System;

class Robot : ISpeakable, IRunnable
{
    public void Speak() => Console.WriteLine("ビープ音！");
    public void Run() => Console.WriteLine("ロボットが走った！");
}
