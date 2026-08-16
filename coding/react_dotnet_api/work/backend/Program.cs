var builder = WebApplication.CreateBuilder(args);

// CORSを許可：ブラウザが「今開いているサイトとは別のオリジン(ドメイン)にあるAPIへのアクセス」を許可するかどうかを制御する仕組み
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});


// ポート番号の固定
builder.WebHost.UseUrls("http://localhost:5080");


// App定義
var app = builder.Build();
app.UseCors();


// リストの定義
var notes = new List<Note>
{
  new(1,"C#とReactの連携を試す"),
  new(2,"CORSの役割を理解する")  
};
var nextId = 3;


// GET時の処理：json形式で、noteリストを送る
app.MapGet("/api/notes", () => notes);


// POST時の処理：
app.MapPost("/api/notes", (NoteInput input) =>
{
    var note = new Note(nextId++, input.text);
    notes.Add(note);
    return Results.Created($"/api/notes/{note.id}",note);
});


// アプリの実行
app.Run();


// クラス的な存在：ちょっとした値のやり取りならこちらもあり
// なんちゃってDTOぐらいのイメージがいいかも
record Note(int id, string text);
record NoteInput(string text);