const box = document.querySelector('#box');
const button = document.querySelector('#toggle-btn');

button.addEventListener('click', () => {
  box.classList.toggle('active');
});
