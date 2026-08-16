# hash_and_signature_basics

## 目的
ハッシュ(完全性)と署名(真正性)の違いを、実際にコードを書いて体感する。

## 実行方法
```bash
python3 sample/hash_demo.py
python3 sample/signature_demo.py
python3 work/hash_demo.py
python3 work/signature_demo.py
```

## ファイル構成
```
hash_and_signature_basics/
├── README.md
├── sample/
│   ├── hash_demo.py       — 完成版：ハッシュの決定論性・雪崩効果
│   └── signature_demo.py  — 完成版：RSA署名の生成・検証・改ざん検知・なりすまし検知
└── work/
    ├── hash_demo.py       — 自分で書いた実装
    └── signature_demo.py  — 自分で書いた実装
```

## 学び
- 同じ入力なら常に同じハッシュ値になる(決定論的)一方、1文字変えるだけで全く別の値になる(雪崩効果)ことを実行結果で確認できた
- 「ハッシュ化」と「署名」は別の処理だと誤解していたが、署名は「ハッシュ化した値を鍵で暗号化/復号する処理」であり、ハッシュ化自体には鍵を使わないと気づいた
- なぜ署名前にハッシュを挟むのか(直接メッセージを暗号化しないのか)が疑問だったが、RSAの演算速度とサイズ制限(鍵サイズより大きいデータを扱えない)という実務的な理由からだとわかった
- 秘密鍵・公開鍵・ハッシュ値・署名で保管先の扱いが全く違う(秘密鍵だけKMS等の専用管理、他はDBでも良い)ことも実装後の疑問から掴めた

## 関連概念
- [information_security_properties.md](../../concepts/information_security_properties.md) — 完全性・真正性を実装レベルで裏付ける実験
