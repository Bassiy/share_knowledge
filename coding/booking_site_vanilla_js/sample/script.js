const form = document.getElementById('booking-form');
const confirmation = document.getElementById('confirmation');

// ← invalidイベントは「ブラウザが無効と判定した瞬間」に各input自身で発生する。
//   ここでpreventDefault()するのは、ネイティブの吹き出しUIを止めて、
//   代わりに自前の .error クラス（CSSで見た目を定義）に差し替えるため
form.querySelectorAll('input').forEach((field) => {
  field.addEventListener('invalid', (event) => {
    event.preventDefault();
    field.classList.add('error');
  });

  // 入力し直された時点で一旦エラー表示を消す（再判定は次のsubmit時）
  field.addEventListener('input', () => {
    field.classList.remove('error');
  });
});

form.addEventListener('submit', (event) => {
  // ❌ 誤解しやすい：submitイベントは何もしなくても止まる
  // ✅ 正しくは：event.preventDefault() を呼ばないとブラウザ標準の動作（ページ再読み込み）が走ってしまう
  event.preventDefault();

  // ❌ 誤解しやすい：inputの入力値は .textContent や .innerText で取れる
  // ✅ 正しくは：フォーム要素の入力値は .value で取得する
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const name = document.getElementById('name').value;

  confirmation.textContent = `${name} 様、${date} ${time} に予約を受け付けました。`;
  confirmation.classList.remove('hidden');

  form.reset();
});
