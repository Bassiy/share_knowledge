const form = document.getElementById('booking-form');
const confirmation = document.getElementById('confirmation');

// querySelectorAll は条件に合う要素を全部まとめて取る
// 取得した全inputに対して、1個ずつ同じ処理を繰り返す
// invalid はHTML標準のバリデーション失敗時に発火するイベント : required の条件を満たさないままsubmitしようとしたときに飛んでくる
// cssで作成したerrorクラスを追加
form.querySelectorAll('input').forEach((field) => {
    field.addEventListener('invalid',(event) => {
        event.preventDefault();
        field.classList.add('error');
    });

    // 入力し直された時点で一旦エラー表示を消す（再判定は次のsubmit時）
    field.addEventListener('input',()=>{
        field.classList.remove('error');
    });
});


form.addEventListener('submit',(event) =>{

    // そのイベントのデフォルト動作をキャンセルする
    // ページリロードを一旦止めている。
    event.preventDefault();

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const name = document.getElementById('name').value;

    confirmation.textContent = `${name} 様、${date} ${time} に予約を受け付けました。`;
    
    //　
    confirmation.classList.remove('hidden');

    // formのインプットを空に戻す。
    form.reset();

});