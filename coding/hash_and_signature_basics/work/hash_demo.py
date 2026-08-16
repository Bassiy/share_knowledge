import hashlib

# ハッシュ化関数
def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


if __name__ == "__main__":

    # 変数定義
    original = b"hello security"
    tampered = b"hello Security"
    print()

    # original
    print("original  :",original)
    print("hash1     :", sha256_hex(original))
    print("hash1(re) :",sha256_hex(original))
    print()

    # tampered
    print("tampered  :",tampered)
    print("hash2     :",sha256_hex(tampered))
