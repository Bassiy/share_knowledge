var builder = WebApplication.CreateBuilder(args);

// ← Reactはindex.htmlを直接開く(file://)か別ポートから叩きに来る、別オリジンの存在。
//   ブラウザは別オリジンへのfetchをデフォルトでブロックするため、サーバー側でCORSを明示的に許可する必要がある
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// ← ポートを固定しないと起動のたびにランダムなポートが割り当てられ、
//   フロント側のfetch先URLと食い違ってしまう
builder.WebHost.UseUrls("http://localhost:5080");

var app = builder.Build();
app.UseCors();

// ← インメモリのList。DBではないのでサーバーを再起動すると消える
var notes = new List<Note>
{
    new(1, "C#とReactの連携を試す"),
    new(2, "CORSの役割を理解する"),
};
var nextId = 3;

app.MapGet("/api/notes", () => notes);

app.MapPost("/api/notes", (NoteInput input) =>
{
    var note = new Note(nextId++, input.Text);
    notes.Add(note);
    return Results.Created($"/api/notes/{note.Id}", note);
});

app.Run();

// ❌ 誤解しやすい：C#側はNote(Id, Text)というPascalCaseのプロパティ名で定義しているので、
//    JSONも{"Id":1,"Text":"..."}のPascalCaseで返ると思いがち
// ✅ 正しくは：ASP.NET CoreのデフォルトJSONシリアライザ(System.Text.Json)は
//    出力時にcamelCaseへ自動変換する。実際に返るのは{"id":1,"text":"..."}
record Note(int Id, string Text);

// ← POSTのリクエストボディ({"text":"..."})を受け取るための型。
//   ASP.NET CoreがリクエストボディのcamelCase JSONを、このrecordの引数名に自動でマッピングしてくれる
record NoteInput(string Text);
