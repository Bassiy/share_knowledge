from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature


# 鍵の生成
def generate_keypair():

    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    return private_key,public_key

# 秘密鍵で署名
def sign(private_key, data: bytes) -> bytes:

    return private_key.sign(
        data,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()),salt_length=padding.PSS.MAX_LENGTH),
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


# メインロジック
if __name__ == "__main__":
    private_key, public_key = generate_keypair()

    message = b"hello security"
    signature = sign(private_key,message)

    # 認証成功
    print("正規の検証:", verify(public_key, message, signature))

    # データ改ざん：失敗
    tampered_message = b"hello Security"
    print("改ざん後の検証:", verify(public_key, tampered_message, signature))

    # なりすまし：失敗
    other_private_key, other_public_key = generate_keypair()
    print("別人の公開鍵での検証:", verify(other_public_key, message, signature))
    