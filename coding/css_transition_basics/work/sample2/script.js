const overlay = document.querySelector('#overlay');
const openButton = document.querySelector('#open-btn');
const closeButton = document.querySelector('#close-btn');

openButton.addEventListener('click', () => {
  overlay.classList.add('open');
});

closeButton.addEventListener('click', () => {
  overlay.classList.remove('open');
});

/* クリックという動作がそもそも行われた瞬間に、その対象がoverlayであったかどうか */ 
/* アロー関数と無名関数を合わせた書き方 */
overlay.addEventListener('click', (event) => {
  // event.targetは実際にクリックされた要素そのもの。
  // #modal内をクリックした場合もイベントは#overlayまでバブリングしてくるので、
  // 「クリックされたのが#overlay自身（=背景部分）の時だけ」を判定して閉じる。
  if (event.target === overlay) {
    overlay.classList.remove('open');
  }
});