const { useState, useRef } = React;

// --- フォーム制御 + リストレンダリング + useRef(DOM操作) ---
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // ← DOM要素（input）そのものに直接アクセスするためのref。
  //   「追加後に入力欄へフォーカスを戻す」のようなDOM操作はuseStateでは表現できない
  const inputRef = useRef(null);

  // ← 採番用のカウンタ。画面に表示しない値なのでuseStateではなくuseRefで持つ。
  //   useStateにすると、値を更新するたびに不要な再レンダリングが起きてしまう
  const nextId = useRef(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    nextId.current += 1;
    setTodos([...todos, { id: nextId.current, text: inputValue, done: false }]);
    setInputValue("");
    inputRef.current.focus(); // ← 追加後、次の入力のためにフォーカスを戻す
  };

  const handleToggle = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* ❌ 誤解しやすい：inputはHTMLの機能で勝手に文字を保持してくれる */}
        {/* ✅ 正しくは：valueとonChangeをセットで渡さない限りReactは値を上書きし続けない。
            この2つを渡すことで初めて「値の出所がstateである」controlled componentになる */}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="やることを入力してEnter"
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {todos.map((todo) => (
          // ← keyはReactが「前回のどの要素と同一か」を判定するための目印。
          //   ここではid（採番したユニークな値）を使う。詳しい理由はKeyPitfallDemoを参照
          <li key={todo.id}>
            <span
              onClick={() => handleToggle(todo.id)}
              style={{
                textDecoration: todo.done ? "line-through" : "none",
                cursor: "pointer",
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

// --- useRefはstateと違い、値を変えても再レンダリングを引き起こさない ---
function RefVsStateDemo() {
  const [renderTrigger, setRenderTrigger] = useState(0);
  const clickCountRef = useRef(0);

  const handleRefClick = () => {
    clickCountRef.current += 1;
    // ❌ 誤解しやすい：ref.currentを書き換えれば画面の表示もすぐ更新される
    // ✅ 正しくは：ref.currentの変更はReactに再レンダリングを要求しない。
    //   画面に見えている数字は「何か別の理由で再レンダリングされた瞬間」の値でしかない
  };

  return (
    <div>
      <p>refのクリック回数（表示は次の再レンダリング時点のスナップショット）: {clickCountRef.current}</p>
      <button onClick={handleRefClick}>refをインクリメント（画面はすぐには変わらないはず）</button>
      {" "}
      <button onClick={() => setRenderTrigger((t) => t + 1)}>
        強制的に再レンダリング（ここでrefの最新値が反映される）
      </button>
    </div>
  );
}

// --- keyにindexを使うと何が壊れるかを再現するデモ ---
function KeyPitfallDemo() {
  const [items, setItems] = useState([
    { id: 1, label: "A" },
    { id: 2, label: "B" },
    { id: 3, label: "C" },
  ]);
  const [useIndexAsKey, setUseIndexAsKey] = useState(false);

  const handleRemoveFirst = () => setItems(items.slice(1));

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={useIndexAsKey}
          onChange={(e) => setUseIndexAsKey(e.target.checked)}
        />
        indexをkeyにする（罠を再現する）
      </label>
      <p>各行のinputに何か文字を入力 → 「先頭を削除」を押して、入力した文字がどの行についていくか観察する</p>

      {items.map((item, index) => (
        // ❌ 誤解しやすい：keyは表示用のユニークIDで、何を使っても結果は同じ
        // ✅ 正しくは：Reactはkeyだけを頼りに「前回と同じ要素かどうか」を判定し、
        //   同じkeyなら既存のDOMノード（とその中で保持されているinputの入力内容）を使い回す。
        //   indexをkeyにすると、配列の先頭を削除してもindexは0,1,2...のまま変わらないため、
        //   Reactは「中身がずれた」ことに気づけず、古いDOMノードをそのまま次の要素に使い回してしまう
        <div key={useIndexAsKey ? index : item.id}>
          {item.label}: <input placeholder="何か入力してみる" />
        </div>
      ))}

      <button onClick={handleRemoveFirst}>先頭を削除</button>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h1>react_todo_app</h1>

      <section>
        <h2>ToDoリスト（フォーム制御 + リストレンダリング + useRef）</h2>
        <TodoApp />
      </section>

      <section>
        <h2>useRef vs useState（再レンダリングを起こすかどうか）</h2>
        <RefVsStateDemo />
      </section>

      <section>
        <h2>keyの罠（indexをkeyにすると何が壊れるか）</h2>
        <KeyPitfallDemo />
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
