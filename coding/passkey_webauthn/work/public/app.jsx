const { useState } = React;


function App() {
    const [log, setLog] = useState([]);

    const addLog = (msg) => setLog((prev) => [...prev,msg]);

    // 登録処理
    const handleRegister = async () => {
        try{
            // チャレンジデータの取得
            const options = await fetch("/register/options").then((r) => r.json());

            // 鍵生成＋生体認証
            const attResp = await SimpleWebAuthnBrowser.startRegistration({ optionsJSON: options});
        
            // 署名データを送付
            const result = await fetch("/register/verify",{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(attResp),
            }).then((r) => r.json());

            addLog(`登録: ${result.verified ? "成功" : "失敗"}`);
        }
        catch (err){
            addLog(`登録エラー: ${err.message}`)
        }
    };

    // ログイン処理
    const handleLogin = async () => {
        try{
            // 公開鍵で暗号化されたチャレンジデータとRP IDの取得
            const options = await fetch("/login/options").then((r) => r.json());

            // RP IDを元に一致する鍵を検索+生体認証
            const authResp = await SimpleWebAuthnBrowser.startAuthentication({ optionsJSON: options });

            // 秘密鍵で署名し、送付
            const result = await fetch("/login/verify",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authResp),
            }).then((r) => r.json());

            addLog(`ログイン: ${result.verified ? "成功" : "失敗"}`);
        }
        catch (err) {
            addLog(`ログインエラー: ${err.message}`);
        }
    };

    return(
        <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
            <h1>Passkey Demo</h1>
            <button onClick={handleRegister}>登録</button>{" "}
            <button onClick={handleLogin}>ログイン</button>
            <pre>{log.join("\n")}</pre>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);