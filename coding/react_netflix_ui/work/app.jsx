const { useState } = React;

// モックデータ
const GENRES = [
    {
        id: "trending",
        title: "今人気の作品",
        items: Array.from({ length: 8 },(_,i) => ({
            id: `trending-${i}`,
            title: `作品 ${i + 1}`,
            imageUrl: `https://picsum.photos/seed/trending-${i}/300/450`,
        }))
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

function NavBar() {
    return(
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
            <span style={{ color: "#e50914", fontSize: "28px", fontWeight: "bold", letterSpacing: "1px"}}>
                NETFLIX
            </span>
            <nav>
                <span>ホーム</span>
                <span>マイリスト</span>
            </nav>
        </header>
    );
}

function Hero() {
    return(
        <div 
            style={{
                position: "relative",
                height: "60vh",
                minHeight: "360px",
                backgroundImage: "url(https://picsum.photos/seed/hero/1280/720)",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            {/* 下と左を黒くフェードさせ、下に続くRow群・テキストの可読性となじませる */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, #141414 0%, rgba(20,20,20,0) 40%), linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
                }}
            >
                <div style={{ position: "absolute", bottom: "80px", left: "40px", maxWidth: "480px" }}>
                    <h1 style={{ fontSize: "48px", margin: "0 0 12px" }}>サンプル・タイトル</h1>
                    <p style={{ fontSize: "16px", lineHeight: 1.5, margin: "0 0 16px" }}>
                        これはUI練習用のダミー説明文です。実際の作品情報ではありません。
                    </p>
                    <div
                        style={{
                            display: "flex", gap: "12px"
                        }}
                    >
                        <button
                            style={{
                                padding: "10px 24px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                border: "none",
                                borderRadius: "4px",
                                background: "white",
                                cursor: "pointer"
                            }}
                        >
                            ▶︎ 再生
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
        </div>
    );
}

function Row( title, children ) {
    return(
        <section style={{ marginBottom: "24px", position: "relative"}}>
            <h2 style={{ marginBottom: "8px", padding: "0 40px", fontSize: "20px"}}>{title}</h2>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom:0,
                    width: "40px",
                    background: "linear-gradient(to right, #141414, rgba(20,20,20,0))",
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <div />
                <div>{children}</div>
                <div />
            </div>
        </section>
    );
}