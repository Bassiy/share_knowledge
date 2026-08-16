const { useState, useEffect } = React;

// API定義
const API_BASE = "http://localhost:5080";


function NotesApp() {
    // 変数定義
    const [notes, setNotes] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    // マウント時にC#側のAPIを叩いて一覧を取得する
    useEffect(() => {
        fetch(`${API_BASE}/api/notes`)
            .then((res) => res.json())
            .then((data => {
                setNotes(data);
                setLoading(false);
            }))
    },[]);

    // 追加ボタン押下時
    const handleSubmit = async (e) => {
        
        // デフォの読み込みを停止
        e.preventDefault();
        
        // 未入力はなにもしない 
        if(text.trim() === "") return;

        // POSTの処理？
        const res = await fetch(`${API_BASE}/api/notes`,{
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({ text }),
        });

        // サーバの通信を受け取る
        const created = await res.json();
        setNotes([...notes,created]);
        setText("");
    };

    if (loading) return <p>読み込み中...</p>;

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="メモを追加"
                />
                <button type="submit">追加</button>
            </form>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>{note.text}</li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    return(
        <div>
            <h1>react_dotnet_api</h1>
            <p>backendを `dotnet run` で起動してからこのページを開いてください（http://localhost:5080）</p>
            <NotesApp />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);