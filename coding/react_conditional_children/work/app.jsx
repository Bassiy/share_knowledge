const { useState } = React;

function ConditionalDemo() {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [unreadCount,setUnreadCount] = useState(0);

    return(
        <div>
            <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
                {isLoggedIn ? "ログアウト" : "ログイン"}する
            </button>

            {/* 三項演算子 */}
            <p>{isLoggedIn ? "ようこそ" : "ログインしてください"}</p>

            <button onClick={() => setUnreadCount(unreadCount + 1)}>通知を追加</button>
            <button onClick={() => setUnreadCount(0)}>既読にする</button>

            {/* 条件を満たすときだけ表示するパターン */}
            {/* 「条件がtrueなら右辺（処理側）の評価結果を返し、falseなら左辺（条件の値そのもの）を返す」 */}
            {unreadCount > 0 && (
                <span style={{ color: "red"}}>未読{unreadCount}件</span>
            )}
        </div>
    );
}

function ZeroPitfallDemo() {
    const [count,setCount] = useState(0);

    return(
        <div>
            <button onClick={() => setCount(count+1)}>+1</button>
            <button onClick={() => setCount(0)}>0に戻す</button>

            <p>誤った書き方: {count && <span>{count}件あります</span>}</p>
            <p>正しい書き方: {count > 0 && <span>{count}件あります</span>}</p>
        </div>
    );
}

function Panel({title, children}) {
    return(
        <div 
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                margin: "8px 0"
            }}
        >
            <h3 style={{ marginTop: 0 }}>{title}</h3>
            {children}
        </div>
    );
}

function ChildrenDemo() {
    const [open, setOpen] = useState(true);

    return(
        <div>
            <Panel title={"プレーンテキスト"}>
                <p>ただのテキストもchildrenになる</p>
            </Panel>

            <Panel title={"別のコンポーネント"}>
                <ConditionalDemo />
            </Panel>

            <Panel title={"開閉トグル"}>
                <button onClick={() => setOpen(!open)}>{open ? "閉じる" : "開く"}</button>
                {open && <p> 開いているときだけ見える中身 </p>}
            </Panel>
        </div>
    );
}

function App() {
    return(
        <div>
            <h1>react_conditional_children</h1>

            <section>
                <h2>条件つきレンダリング</h2>
                <ConditionalDemo />
            </section>

            <section>
                <h2>&&の落とし穴</h2>
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
