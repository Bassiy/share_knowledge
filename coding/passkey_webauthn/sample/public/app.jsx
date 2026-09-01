const { useState } = React;

function App() {
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog((prev) => [...prev, msg]);

  const handleRegister = async () => {
    try {
      const options = await fetch("/register/options").then((r) => r.json());

      // ← ここでブラウザが navigator.credentials.create() を呼ぶ。
      //   鍵ペア生成・Secure Enclaveへの保存・生体認証はすべてこの1行の内側で起きる
      const attResp = await SimpleWebAuthnBrowser.startRegistration({ optionsJSON: options });

      const result = await fetch("/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attResp),
      }).then((r) => r.json());

      addLog(`登録: ${result.verified ? "成功" : "失敗"}`);
    } catch (err) {
      addLog(`登録エラー: ${err.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const options = await fetch("/login/options").then((r) => r.json());

      // ← ここでブラウザが navigator.credentials.get() を呼ぶ。
      //   options.allowCredentials に載ってるRP IDと一致する鍵がなければ、
      //   この時点で候補ゼロになりエラーで返ってくる（フィッシング耐性の実体）
      const authResp = await SimpleWebAuthnBrowser.startAuthentication({ optionsJSON: options });

      const result = await fetch("/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authResp),
      }).then((r) => r.json());

      addLog(`ログイン: ${result.verified ? "成功" : "失敗"}`);
    } catch (err) {
      addLog(`ログインエラー: ${err.message}`);
    }
  };

  return (
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
