const form = document.getElementById('booking-form');
const confirmation = document.getElementById('confirmation');

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
