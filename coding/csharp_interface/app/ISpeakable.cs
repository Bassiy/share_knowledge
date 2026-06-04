// インターフェースは「型」であり「契約書」
// → 変数の型・リストの型として使える（型である）
// → new ISpeakable() はできない（実体を持てない抽象型）
// → 中身はない。Speakできることの約束を定義するだけ
// ※ 命名は Can-do を表す形容詞 + able が慣習（IAnimal はスーパークラスっぽいのでNG）
interface ISpeakable
{
    void Speak(); // 中身なし。「Speakできること」という約束の定義だけ
}
