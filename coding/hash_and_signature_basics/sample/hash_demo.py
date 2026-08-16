import hashlib


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


if __name__ == "__main__":
    original = b"hello security"
    tampered = b"hello Security"  # 1文字だけ大文字に変更

    print()
    print("original:", original)
    print("hash1   :", sha256_hex(original))
    print("hash1(再計算):", sha256_hex(original))# 同じ入力なら常に同じハッシュ値になる（決定論的）

    print()
    print("tampered:", tampered)
    print("hash2   :", sha256_hex(tampered))
    print()

    # 1文字変えるだけで、ハッシュ値は全く別物になる（雪崩効果）
    # → 受け取ったデータのハッシュを再計算し、送信時のハッシュ値と一致するかを見れば
    #   「改ざんされていないか（完全性）」を確認できる。
    # ただしハッシュ単体では「誰が作ったか」は証明できない（＝真正性は別の話）。
