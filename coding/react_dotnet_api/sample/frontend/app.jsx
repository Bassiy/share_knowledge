const { useState, useEffect } = React;

// ← backend/ を `dotnet run` で起動した状態で、このindex.htmlを直接ブラウザで開く
const API_BASE = "http://localhost:5080";

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // ← マウント時にC#側のAPIを叩いて一覧を取得する
  useEffect(() => {
    fetch(`${API_BASE}/api/notes`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    // ← POSTのbodyはJSON文字列にして送る。C#側はNoteInputレコードとして受け取る
    const res = await fetch(`${API_BASE}/api/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const created = await res.json();
    setNotes([...notes, created]);
    setText("");
  };

  if (loading) return <p>読み込み中...</p>;

  return (
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
          // ← C#側はNote(Id, Text)というPascalCaseのプロパティ名で定義しているが、
          //   JSONにシリアライズされる時点でcamelCase(id, text)に変換される
          <li key={note.id}>{note.text}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h1>react_dotnet_api</h1>
      <p>backendを `dotnet run` で起動してからこのページを開いてください（http://localhost:5080）</p>
      <NotesApp />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
