// javascriptの分割代入
// reactというオブジェクトからこの２つを取り出して使っているよって話
const { useState, useEffect } = React;

// strong : 重要なテキストであることを示すタグ
// 条件 ? 真の場合の値 : 偽の場合の値 の形
// 等価比較 : ３つの場合、型変換せず、型も値も両方一致していないとtrueにならない。
function Message({count}){
    return(
        <p>
            現在の値は<strong>{count}</strong>({count % 2 === 0 ? "偶数" : "奇数"})
        </p>
    );
}

// クリックされたらonDecrementという関数を実行する
function Counter({count, OnIncrement, onDecrement }){
    return(
        <div>
            <button onClick={onDecrement}>-1</button>
            <span style={{ margin:"0 8px" }}>{count}</span>
            <button onClick={OnIncrement}>+1</button>
        </div>
    );
}


function ElapsedTimer(){
    // 分割代入
    // [現在のstateの値, その値を更新するための関数]
    // useState(0)を呼び出すと、Reactは要素が2つだけの配列を返す
    // secondsという名前のstateを、最初は0からスタートさせてください」
    // 言ってしまえば、ただの変数定義ではある。
    const [seconds , setSeconds] = useState(0);

    // useEffect(() => { ... }, []); // 空配列 → 初回マウント時のみ実行
    // setInterval(処理, 間隔ミリ秒)
    //   → 1秒おきに、setSecondsを+1に更新
    useEffect(() => {
        const timeId = setInterval(() => {
            setSeconds((prev) => (prev + 1));
        },1000);

        return () => clearInterval(timeId);
    },[]);

    return <p>経過秒数：{seconds}s</p>

}

function App() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => setCount(count + 1);
    const handleDecrement = () => setCount(count - 1);
    // const handleIncrement = () => setCount((count) => (count + 1));

    // countが変化したら処理を実行
    useEffect(() => {
        document.title = `count: ${count}`;
    },[count]);

    return(
        <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
            <h1>react_basics</h1>

            <section>
                <h2>props</h2>
                {/* countというpropsを子に渡している。Counter/Message自身はstateを持たない */}
                <Message count={count} />
                <Counter 
                    count={count}
                    OnIncrement={handleIncrement}
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