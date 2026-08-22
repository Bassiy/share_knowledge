# totp_minimal

## 目的
TOTP(RFC 6238)を標準ライブラリ(hmac, hashlib, time, base64)のみで最小実装する。
秘密鍵生成・6桁コード生成・検証を作り、実際のAuthenticatorアプリ(Google Authenticatorなど)と
突き合わせて「同じ数字が出るか」を確認する。

## 実行方法

```bash
cd sample  # または work
python3 totp.py
```

secretとotpauth URIが表示される。Authenticatorアプリの「セットアップキーを入力」に `secret=` の値だけ(URI全体ではない)を貼って登録すると、表示され続ける6桁コードと一致するか確認できる。

登録済みの特定のsecretで検証したい場合は関数を直接呼ぶ。

```bash
python3 -c "
from totp import totp
print(totp('登録したsecret文字列'))
"
```

## ファイル構成
```
totp_minimal/
├── README.md
├── sample/
│   └── totp.py
└── work/
    └── totp.py
```

## 学び

### 実装して初めて気づいたこと

| 誤解 | 正しい理解 |
|--|--|
| `secrets.token_bytes()` で作ったランダムバイト列をそのまま `b32decode()` すればbase32文字列になる | `b32decode` は「base32文字列→バイト列」の変換。ランダムバイト列→base32文字列にするには逆の `b32encode` を使う |
| counter(int)をそのまま`hmac.new()`に渡せる | HMACの入力は`bytes`。`counter.to_bytes(8, byteorder="big")` で明示的に変換する必要がある |
| dynamic truncationで取り出した4バイトはそのまま数値化してよい | 先頭バイトの最上位ビット(符号ビット)を`& 0x7FFFFFFF`でマスクしてから数値化する(RFC 4226の規定) |
| コードの一致判定は`==`でよい | タイミング攻撃を避けるため`hmac.compare_digest()`を使う |
| `float \| None`のような型ヒント(PEP 604)はどのPythonでも書ける | Python 3.10未満では実行時エラーになる。`from __future__ import annotations`をファイル**先頭**(他のimportより前)に置く必要がある |
| Authenticatorアプリの「セットアップキー」欄には`otpauth://`のURI全体を貼ってよい | その欄はbase32文字列(`secret=`の値)専用。URI全体を貼ると`:`や`/`が不正な文字としてエラーになる |

---

### バグが「動いているように見えた」理由

`generate_secret()`にバグ(`b32decode`/`b32encode`の逆転)が残っていても、`totp()`を固定のsecret文字列で直接呼ぶテストでは`generate_secret()`自体を通らないため、エラーに気づけなかった。「動いた」は「実行したパスにバグがなかった」だけで「バグが無い」の証明にはならない、という実装あるあるを体感した。

## 関連概念
- [totp.md](../../concepts/totp.md) — この実験の元になった概念
