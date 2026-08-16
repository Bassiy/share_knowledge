const { useState } = React;

// 画像はpicsum.photosのプレースホルダー。seedを固定しているので同じURLなら毎回同じ画像になる
const GENRES = [
  {
    id: "trending",
    title: "今人気の作品",
    items: Array.from({ length: 8 }, (_, i) => ({
      id: `trending-${i}`,
      title: `作品 ${i + 1}`,
      imageUrl: `https://picsum.photos/seed/trending-${i}/300/450`,
    })),
  },
  {
    id: "action",
    title: "アクション",
    items: Array.from({ length: 8 }, (_, i) => ({
      id: `action-${i}`,
      title: `アクション ${i + 1}`,
      imageUrl: `https://picsum.photos/seed/action-${i}/300/450`,
    })),
  },
  {
    id: "comedy",
    title: "コメディ",
    items: Array.from({ length: 8 }, (_, i) => ({
      id: `comedy-${i}`,
      title: `コメディ ${i + 1}`,
      imageUrl: `https://picsum.photos/seed/comedy-${i}/300/450`,
    })),
  },
];

// 以下NavBar/Hero/Row内のグラデーション演出はCSSでの見た目調整であり、
// 新しいReactの概念は登場しない（childrenと条件付きレンダリングの応用のみ）

function NavBar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
      }}
    >
      <span style={{ color: "#e50914", fontSize: "28px", fontWeight: "bold", letterSpacing: "1px" }}>
        NETFLIX
      </span>
      <nav style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#e5e5e5" }}>
        <span>ホーム</span>
        <span>マイリスト</span>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <div
      style={{
        position: "relative",
        height: "60vh",
        minHeight: "360px",
        backgroundImage: "url(https://picsum.photos/seed/hero/1280/720)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 下と左を黒くフェードさせ、下に続くRow群・テキストの可読性となじませる */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, #141414 0%, rgba(20,20,20,0) 40%), linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div style={{ position: "absolute", bottom: "80px", left: "40px", maxWidth: "480px" }}>
        <h1 style={{ fontSize: "48px", margin: "0 0 12px" }}>サンプル・タイトル</h1>
        <p style={{ fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" }}>
          これはUI練習用のダミー説明文です。実際の作品情報ではありません。
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              padding: "10px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
            }}
          >
            ▶ 再生
          </button>
          <button
            style={{
              padding: "10px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "4px",
              background: "rgba(109,109,110,0.7)",
              color: "white",
              cursor: "pointer",
            }}
          >
            詳細情報
          </button>
        </div>
      </div>
    </div>
  );
}

// ← Rowは「タイトル」と「並べるカード群(children)」を受け取るだけの箱。
//   中身がどのジャンルの・何枚のカードかは一切知らない
function Row({ title, children }) {
  return (
    <section style={{ marginBottom: "24px", position: "relative" }}>
      <h2 style={{ marginBottom: "8px", padding: "0 40px", fontSize: "20px" }}>{title}</h2>
      <div style={{ position: "relative" }}>
        {/* 左右端のグラデーションフェード。pointerEvents:noneでクリック/スクロール操作を透過させる */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "40px",
            background: "linear-gradient(to right, #141414, rgba(20,20,20,0))",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
        <div
          className="row-scroll"
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            padding: "0 40px 8px",
          }}
        >
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "40px",
            background: "linear-gradient(to left, #141414, rgba(20,20,20,0))",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
    </section>
  );
}

function Card({ title, imageUrl }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        flex: "0 0 auto",
        width: "160px",
        height: "240px",
        borderRadius: "6px",
        overflow: "hidden",
        cursor: "pointer",
        transform: isHovered ? "scale(1.08)" : "scale(1)",
        transition: "transform 150ms ease",
        boxShadow: isHovered ? "0 8px 16px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* ホバー時だけ表示するオーバーレイ。条件付きレンダリング(&&)の実践 */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "8px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{title}</p>
          <p style={{ margin: 0 }}>▶ 再生</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div style={{ background: "#141414", color: "white", minHeight: "100vh", paddingBottom: "40px" }}>
      {/* NavBarはposition:fixedなのでドキュメントの流れに幅を取らない。
          Heroは高さ0スタートから始まり、NavBarはその上に透明なグラデーションとして重なる */}
      <NavBar />
      <Hero />

      {GENRES.map((genre) => (
        // ← Rowタグの間に.mapで作ったCard配列をそのまま書いている。
        //   これも「タグの間に書いたJSXがchildrenになる」の一例で、
        //   childrenは単一要素だけでなく配列でも渡せる。Row側は中身が何個あるかも知らない
        <Row key={genre.id} title={genre.title}>
          {genre.items.map((item) => (
            <Card key={item.id} title={item.title} imageUrl={item.imageUrl} />
          ))}
        </Row>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
