const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const preview = document.getElementById('preview');

// クリックでもinput type="file"のネイティブな選択ダイアログを開けるようにする
dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  handleFile(fileInput.files[0]);
});

dropzone.addEventListener('dragenter', () => {
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

// ← dragoverでpreventDefault()しないと、ブラウザの既定動作（画像を別タブで開く等）が
//   走ってしまい、dropイベントそのものが発火しない
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  // ← input.filesと同じ型（FileList）がe.dataTransfer.filesに入っている
  handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}
