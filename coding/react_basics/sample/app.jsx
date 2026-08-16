const { useState, useEffect } = React;

// --- props：親から渡された値を「読むだけ」のコンポーネント ---
// ❌ 誤解しやすい：propsは子コンポーネント内で書き換えられる
// ✅ 正しくは：propsは読み取り専用（immutable）。子は親からもらった値を表示するだけで、
//   値を変えたいときは親が持つstateを親自身が更新する（onIncrementのような関数をpropsで渡す）
function Message({ count }) {
  return (
    <p>
      現在の値は <strong>{count}</strong>（{count % 2 === 0 ? "偶数" : "奇数"}）
    </p>
  );
}

function Counter({ count, onIncrement, onDecrement }) {
  return (
    <div>
      <button onClick={onDecrement}>-1</button>
      <span style={{ margin: "0 8px" }}>{count}</span>
      <button onClick={onIncrement}>+1</button>
    </div>
  );
}

// --- useEffect：マウント時に1回だけ実行し、アンマウント時にクリーンアップする例 ---
function ElapsedTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 依存配列が空 [] → 「マウント時に1回だけ」実行される
    const timerId = setInterval(() => {
      setSeconds((prev) => prev + 1); // ← 前の値を使う更新は関数形式で書く
    }, 1000);

    // ✅ returnした関数はクリーンアップ処理。
    // このコンポーネントがアンマウントされる時、または次にeffectが再実行される直前に呼ばれる。
    // ここで解除し忘れると、setIntervalが動き続けてメモリリーク・意図しない更新の原因になる
    return () => clearInterval(timerId);
  }, []); // ← 空配列 = 依存する値がない = 初回のみ実行

  return <p>経過秒数: {seconds}s</p>;
}

function App() {
  const [count, setCount] = useState(0);

  // ❌ 誤解しやすい：setCount(count) を呼んだ瞬間に count の値が変わる
  // ✅ 正しくは：setStateは「次のレンダリングで使う値」を予約するだけ。
  //   同期的に即時反映されるわけではない（このあとのコードでcountを読んでも古い値のまま）
  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);

  useEffect(() => {
    // 依存配列に [count] → countが変わるたびに実行される
    document.title = `count: ${count}`;
  }, [count]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h1>react_basics</h1>

      <section>
        <h2>props</h2>
        {/* countというpropsを子に渡している。Counter/Message自身はstateを持たない */}
        <Message count={count} />
        <Counter
          count={count}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </section>

      <section>
        <h2>useEffect（依存配列とクリーンアップ）</h2>
        <ElapsedTimer />
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
