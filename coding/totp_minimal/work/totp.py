from __future__ import annotations

import base64
import hashlib
import hmac
import time



#
# 以下で実行をして作成したdemoを確かめる
# Google Authenticaterで試した。
#
# python3 -c "
# from totp import totp
# secret = '4VMKBZFLMBEV6HE6FJIRXLBSMQ6QWW6U'
# print(totp(secret))
# "
#


# utf-8のbase32文字列で、秘密鍵を生成
def generate_secret(num_byte: int = 20) -> str:
    import secrets

    raw = secrets.token_bytes(num_byte)
    return base64.b32encode(raw).decode("utf-8")


# 
def _hope(secret_bytes: bytes, counter: int) -> str:

    counter_bytes = counter.to_bytes(8,byteorder="big")
    hmac_hash = hmac.new(secret_bytes, counter_bytes, hashlib.sha1).digest()

    offset = hmac_hash[-1] & 0x0F
    truncated = hmac_hash[offset : offset + 4]

    code_int = int.from_bytes(truncated, byteorder="big") & 0x7FFFFFFF
    code = code_int % 1_000_000

    return f"{code:06d}"


def totp(secret_b32: str, for_time: float | None=None, step: int = 30) -> str:

    if for_time is None:
        for_time = time.time()

    secret_bytes = base64.b32decode(secret_b32)

    counter = int(for_time // step)

    return _hope(secret_bytes, counter)

def verify(secret_b32:str, code:str, window: int = 1, step: int = 30) -> bool:

    now = time.time()

    for offset in range(-window, window+1):
        candidate = totp(secret_b32, for_time=now + offset * step, step=step)

        if hmac.compare_digest(candidate, code):
            return True

    return False


def build_otpauth_uri(secret_b32: str, account_name: str, issuer: str = "info-lab") -> str:

    return (
        f"otpauth://totp/{issuer}:{account_name}"
        f"?secret={secret_b32}&issuer={issuer}&algorithm=SHA1&digits=6&period=30"
    )

if __name__ == "__main__":
    secret = generate_secret()
    print(f"secret (base32):{secret}")
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