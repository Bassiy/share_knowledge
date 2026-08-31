const { useState, useEffect } = React;

// ← backend/ を `dotnet run` で起動した状態で、このindex.htmlを直接ブラウザで開く
const API_BASE = "http://localhost:5081";

// ← Presentational：データ取得をせず、propsで受け取ったpagesを表示するだけ
//   （container_presentational_pattern.md の ui-elements/ui-parts に相当）
function PagesList({ pages }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>content</th>
          <th>parentId</th>
        </tr>
      </thead>
      <tbody>
        {pages.map((page) => (
          <tr key={page.id}>
            <td>{page.id}</td>
            <td>{page.title}</td>
            <td>{page.content}</td>
            {/* ← parentIdがnullのルートページは "-" と表示する（Phase 2でネスト表示にする前段） */}
            <td>{page.parentId ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ← Container：マウント時にAPIを一括fetchし、結果をPagesListにpropsで渡すだけ
//   （container_presentational_pattern.md の pages/ に相当。データ取得はここだけの責務）
function PagesPage() {
  const [pages, setPages] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/pages`)
      .then((res) => res.json())
      .then(setPages);
  }, []);

  if (pages === null) return <p>読み込み中...</p>;

  return <PagesList pages={pages} />;
}

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h1>react_dotnet_oracle_api</h1>
      <p>backendを `dotnet run` で起動してからこのページを開いてください（http://localhost:5081）</p>
      <PagesPage />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
