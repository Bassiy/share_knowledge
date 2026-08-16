// reactというオブジェクトからこの２つを取り出して使っているよって話
const { useState, useRef} = React


function TodoApp(){
    // リスト型で空のリストを初期値にする
    const [todos,setTodos] = useState([]);
    const [inputValue,setInputValue] = useState("");

    // useRefでDOM要素を直接参照できる。
    // レンダリングを跨いで値を保持することができる
    // useRef : その値の変化を画面に反映させる必要がない(レンダリングのトリガーにならない)
    const inputRef = useRef(null);

    // 採番用カウンタ
    const nextId = useRef(0);

    // Todo追加ボタン押下時
    // 宣言関数
    // e : イベントオブジェクト
    const handleSubmit = (e) => {
        // submitオブジェクトの持つページリロードの挙動を停止
        e.preventDefault();
        // 空ならスルー
        if(inputValue.trim() === "") return;

        // idのインクリメント
        nextId.current += 1

        // [...todos] : スプレット構文（「.」の数だけ要素がある）
        setTodos([...todos,{ id: nextId.current, text: inputValue, done: false}]);
        // 入力欄のリセット
        setInputValue("");
        // フォーカスを戻す
        inputRef.current.focus();
    }


    // doneの切り替え処理
    // mapは配列の全要素を順番に処理して、新しい配列を作るメソッド
    // Reactでは元の配列を直接書き換えず「新しい配列を作ってsetする」のが鉄則
    const handleToggle = (id) => {
        setTodos(todos.map((t) => (t.id === id ? {...t, done: !t.done} : t)));
    };


    // 削除処理
    const handleDelete = (id) =>{
        setTodos(todos.filter((t) => t.id !== id));
    };


    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="やることを入力してください"
                />
                <button type="submit">追加</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <span
                            onClick={() => {handleToggle(todo.id)}}
                            style={{
                                textDecoration: todo.done ? "line-through" : "none",
                                cursor: "pointer"
                            }}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => handleDelete(todo.id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RefVsStateDemo(){
    const [renderTrigger,setRenderTrigger] = useState(0);
    const clickCountRef = useRef(0);

    const handleRefClick = () => {
        clickCountRef.current += 1;
    }

    return (
        <div>
            <p>refのクリック回数（表示は次の再レンダリング時点のスナップショット）：{clickCountRef.current}</p>
            <button onClick={handleRefClick}>refをインクリメント（画面はすぐには変わらないはず）</button>
            {" "}
            <button
                onClick={() => setRenderTrigger((t) => t + 1)}
            >
                強制的に再レンダリング（ここでrefの最新値が反映される）
            </button>
        </div>
    );
}

function KeyPitfallDemo (){
    const [items,setItems] = useState([
        { id: 1, label: "A" },
        { id: 2, label: "B" },
        { id: 3, label: "C" }
    ]);

    const [useIndexAsKey, setUseIndexAsKey] = useState(false);

    // Itemsの先頭を削除
    const handleRemoveFirst = () => setItems(items.slice(1));


    // map(要素、参照する要素番号)
    // ループ処理のイメージ
    return(
        <div>
            <label>
                <input 
                    type="checkbox"
                    checked={useIndexAsKey}
                    onClick={(e) => setUseIndexAsKey(e.target.checked)}
                />
                indexをkeyにする（罠を再現する）
            </label>
            <p>各行のinputに何か文字を入力  → 「先頭を削除」を押して、入力した文字がどの行についていくか観察する</p>

            {items.map((item, index) => (
                <div key={useIndexAsKey ? index : item.id}>
                    {item.label}:<input placeholder="何かを入力してみる" />
                </div>
            ))}

            <button onClick={handleRemoveFirst}>先頭を削除</button>

        </div>
    );
}

function App () {
    return(
        <div style={{ fontFamily: "sans-serif" , padding: "16px"}}>
            <h1>react_todo_app</h1>
            
            <section>
                <h2>ToDoリスト</h2>
                <TodoApp />
            </section>

            <section>
                <h2>useref vs useState</h2>
                <RefVsStateDemo />
            </section>

            <section>
                <h2>keyの罠</h2>
                <KeyPitfallDemo />
            </section>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);