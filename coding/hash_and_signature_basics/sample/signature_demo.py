from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature


# 鍵の生成
def generate_keypair():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()
    return private_key, public_key

# 秘密鍵で署名
def sign(private_key, data: bytes) -> bytes:
    # 秘密鍵は本人しか持っていない → これで署名できること自体が「本人が作った」証明になる
    return private_key.sign(
        data,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256(),
    )

# 公開鍵で検証
def verify(public_key, data: bytes, signature: bytes) -> bool:
    try:
        public_key.verify(
            signature,
            data,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256(),
        )
        return True
    except InvalidSignature:
        return False


if __name__ == "__main__":
    # 鍵の生成
    private_key, public_key = generate_keypair()

    # 署名
    message = b"hello security"
    signature = sign(private_key, message)

    # 認証
    # ケース1: 正しいデータ・正しい鍵 → 検証成功（本人が作り、改ざんもされていない）
    print("正規の検証:", verify(public_key, message, signature))

    # ケース2: データを改ざん → 検証失敗（完全性が破られている）
    tampered_message = b"hello Security"
    print("改ざん後の検証:", verify(public_key, tampered_message, signature))

    # ケース3: 別人の鍵で検証 → 検証失敗（なりすまし＝真正性が破られている）
    other_private_key, other_public_key = generate_keypair()
    print("別人の公開鍵での検証:", verify(other_public_key, message, signature))

    # ← ハッシュ単体（hash_demo.py）は「改ざんされていないか」しか確認できないが、
    #   署名は秘密鍵という「本人しか持っていないもの」を使うことで、
    #   「改ざんされていないか」と「本人が作ったものか」の両方を同時に証明できる。
