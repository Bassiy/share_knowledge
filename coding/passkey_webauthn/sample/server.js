import express from 'express';
import session from 'express-session';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret: 'demo-secret-not-for-production',
    resave: false,
    saveUninitialized: true,
  }),
);

const rpName = 'Passkey Demo';
const rpID = 'localhost';
const origin = `http://${rpID}:3000`;

// デモ用：単一ユーザーをメモリ上に保持（本来はDBに保存する）
const user = {
  id: 'demo-user-id',
  username: 'demo-user',
  credentials: [], // { id, publicKey, counter, transports }
};

app.get('/register/options', async (req, res) => {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.username,
    // ❌ 誤解しやすい：userIDは文字列ではない
    // ✅ 正しくは：Uint8Arrayを要求される（TextEncoderでエンコード）
    userID: new TextEncoder().encode(user.id),
    attestationType: 'none',
    excludeCredentials: user.credentials.map((cred) => ({
      id: cred.id,
      transports: cred.transports,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // チャレンジは使い捨て。次のverifyで一致確認するまでの間だけ保持する
  req.session.currentChallenge = options.challenge;
  res.json(options);
});

app.post('/register/verify', async (req, res) => {
  try {
    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: req.session.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ verified: false });
    }

    const { credential } = verification.registrationInfo;
    user.credentials.push({
      id: credential.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      transports: req.body.response.transports,
    });

    res.json({ verified: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ verified: false, error: err.message });
  }
});

app.get('/login/options', async (req, res) => {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    // ← passkey.mdで学んだ「現在のオリジンに一致する鍵があるか確認」の実体。
    //   ここで渡すRP IDと紐付いた鍵しかブラウザ側の候補に出てこない
    allowCredentials: user.credentials.map((cred) => ({
      id: cred.id,
      transports: cred.transports,
    })),
  });

  req.session.currentChallenge = options.challenge;
  res.json(options);
});

app.post('/login/verify', async (req, res) => {
  const credential = user.credentials.find((cred) => cred.id === req.body.id);

  if (!credential) {
    return res.status(400).json({ verified: false, error: '登録された鍵が見つかりません' });
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: req.session.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: credential.id,
        publicKey: credential.publicKey,
        counter: credential.counter,
      },
    });

    if (!verification.verified) {
      return res.status(400).json({ verified: false });
    }

    // ← リプレイ攻撃対策：認証器が返すカウンタが単調増加しているかを見ている。
    //   複製された認証器（クローン）を検知するための仕組み
    credential.counter = verification.authenticationInfo.newCounter;

    res.json({ verified: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ verified: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log('http://localhost:3000 で起動中');
});
