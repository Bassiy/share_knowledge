const { useState } = React;

// --- 条件付きレンダリング: 三項演算子(どちらか必ず表示) と &&(表示/非表示) ---
function ConditionalDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "ログアウト" : "ログイン"}する
      </button>

      {/* 三項演算子: elseがある「どちらか片方を必ず表示する」パターン */}
      <p>{isLoggedIn ? "ようこそ！" : "ログインしてください"}</p>

      <button onClick={() => setUnreadCount(unreadCount + 1)}>通知を追加</button>
      <button onClick={() => setUnreadCount(0)}>既読にする</button>

      {/* && : elseがない「条件を満たす時だけ表示する」パターン */}
      {unreadCount > 0 && (
        <span style={{ color: "red" }}> 未読 {unreadCount} 件</span>
      )}
    </div>
  );
}

// --- &&の落とし穴: 左辺が数値の0だとfalsyでも「0」がそのまま画面に出る ---
function ZeroPitfallDemo() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>0に戻す</button>

      {/* ❌ 誤解しやすい：count && <span>件あります</span>
          countが0の時、falsyだから何も表示されないと思いきや、
          Reactは「0」という数値そのものを表示すべき値として扱うため画面に0が出てしまう */}
      <p>誤った書き方: {count && <span>件あります</span>}</p>

      {/* ✅ 正しくは比較演算子でboolean化してから&&に渡す */}
      <p>正しい書き方: {count > 0 && <span>件あります</span>}</p>
    </div>
  );
}

// ← Panelはtitleとchildrenだけを受け取る「箱」。中身が何であるかを一切知らない・関知しない
function Panel({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        margin: "8px 0",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

// --- children: タグの間に書いたJSXがそのままchildren propsとして渡される ---
function ChildrenDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* <Panel title="...">ここ</Panel> の「ここ」が Panel から見ると props.children になる。
          <Panel title="..." children={...} /> と書くのと本質的に同じで、タグの間に書けるのはただの糖衣構文 */}
      <Panel title="プレーンテキスト">
        <p>ただのテキストもchildrenになる</p>
      </Panel>

      <Panel title="別のコンポーネント">
        {/* ネストしたコンポーネントもそのままchildrenになる。Panel側は中身が何かを全く知らない */}
        <ConditionalDemo />
      </Panel>

      <Panel title="開閉トグル（children + 条件付きレンダリングの組み合わせ）">
        <button onClick={() => setOpen(!open)}>{open ? "閉じる" : "開く"}</button>
        {open && <p>開いている時だけ見える中身</p>}
      </Panel>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h1>react_conditional_children</h1>

      <section>
        <h2>条件付きレンダリング（三項演算子 / &&）</h2>
        <ConditionalDemo />
      </section>

      <section>
        <h2>&&の落とし穴（0がそのまま表示される）</h2>
        <ZeroPitfallDemo />
      </section>

      <section>
        <h2>children（コンポーネント合成）</h2>
        <ChildrenDemo />
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
