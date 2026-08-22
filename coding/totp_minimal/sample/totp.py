"""TOTP (RFC 6238) の最小実装。標準ライブラリのみで完結する。

Google Authenticator などのアプリと相互運用するため、
秘密鍵は base32 でやり取りする(otpauth:// URI の仕様に合わせるため)。
"""

# ← `float | None` のような書き方(PEP 604)はPython 3.10からの機能。
#   3.9以下でも動かすためにこの一行を入れておく(型ヒントが文字列扱いになり実行時evalされない)。
from __future__ import annotations

import base64
import hashlib
import hmac
import time


def generate_secret(num_bytes: int = 20) -> str:
    """ランダムな秘密鍵を生成し、base32文字列で返す。

    ← 20バイト(160bit)にしているのは HMAC-SHA1 のブロックサイズに合わせた慣習。
    RFC的には短くても動くが、Authenticatorアプリ側はこの長さを前提にしていることが多い。
    """
    import secrets

    raw = secrets.token_bytes(num_bytes)
    return base64.b32encode(raw).decode("utf-8")


def _hotp(secret_bytes: bytes, counter: int) -> str:
    """HOTP: カウンタ値から6桁コードを作る(RFC 4226)。TOTPはこのcounterに時刻を使うだけ。"""

    # ❌ 誤解しやすい: counterをそのままintとしてhmacに渡せる、と思いがち
    # ✅ 正しくは: HMACの入力はbytesなので、counterを8バイトのビッグエンディアンに変換する必要がある
    counter_bytes = counter.to_bytes(8, byteorder="big")

    # HMAC-SHA1(秘密鍵, カウンタ) を計算。ここが「決定的」であることが仕組みの前提。
    hmac_hash = hmac.new(secret_bytes, counter_bytes, hashlib.sha1).digest()

    # ← Dynamic Truncation (RFC 4226 section 5.3)
    # ハッシュの最後の4bitを「どこから4バイト読むか」のオフセットとして使う
    offset = hmac_hash[-1] & 0x0F
    truncated = hmac_hash[offset : offset + 4]

    # ❌ 誤解しやすい: 取り出した4バイトをそのまま数値化すればいい、と思いがち
    # ✅ 正しくは: 先頭1バイトの最上位ビット(符号ビット)を0にマスクしてから数値化する
    #    (符号付き整数として解釈されるのを防ぐため。RFC上の決まり)
    code_int = int.from_bytes(truncated, byteorder="big") & 0x7FFFFFFF

    code = code_int % 1_000_000
    return f"{code:06d}"  # 6桁に満たない場合は0埋め(これを忘れると桁がズレる)


def totp(secret_b32: str, for_time: float | None = None, step: int = 30) -> str:
    """現在時刻(または指定時刻)から6桁のTOTPコードを生成する。"""

    if for_time is None:
        for_time = time.time()

    secret_bytes = base64.b32decode(secret_b32)

    # ← ここがTOTPとHOTPの唯一の違い: counterを「時刻を30秒で割った値」にする
    counter = int(for_time // step)

    return _hotp(secret_bytes, counter)


def verify(secret_b32: str, code: str, window: int = 1, step: int = 30) -> bool:
    """コードを検証する。時刻のズレを許容するため前後 `window` ステップも確認する。"""

    now = time.time()

    for offset in range(-window, window + 1):
        candidate = totp(secret_b32, for_time=now + offset * step, step=step)

        # ❌ 誤解しやすい: 普通の `==` で文字列比較すればいい、と思いがち
        # ✅ 正しくは: タイミング攻撃を避けるため hmac.compare_digest を使う
        #    (==は先頭から1文字ずつ比較して不一致で即終了するため、比較にかかる時間の差から
        #     正解の桁数を推測される可能性がある)
        if hmac.compare_digest(candidate, code):
            return True

    return False


def build_otpauth_uri(secret_b32: str, account_name: str, issuer: str = "info-lab") -> str:
    """Google Authenticator等でQRコード読み取りに使えるURIを作る(手入力用の文字列としても使える)。"""

    return (
        f"otpauth://totp/{issuer}:{account_name}"
        f"?secret={secret_b32}&issuer={issuer}&algorithm=SHA1&digits=6&period=30"
    )


if __name__ == "__main__":
    secret = generate_secret()
    print(f"secret (base32): {secret}")
    print(f"otpauth URI: {build_otpauth_uri(secret, account_name='demo-user')}")
    print()
    print("↑ このURIをQRコード化してAuthenticatorアプリで読み取るか、")
    print("  secretの文字列を手入力で登録すると、以下と同じ数字が出るはず。")
    print()

    try:
        while True:
            code = totp(secret)
            remaining = 30 - int(time.time()) % 30
            print(f"\rcurrent code: {code}  (残り{remaining:2d}秒)", end="", flush=True)
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n終了")
