using Oracle.ManagedDataAccess.Client;

var builder = WebApplication.CreateBuilder(args);

// ← react_dotnet_apiと同じ理由：file://で開くReact側は別オリジンなのでCORSを明示的に許可する
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// ← react_dotnet_api(5080)と同時に動かす可能性があるので別ポートにしている
builder.WebHost.UseUrls("http://localhost:5081");

var app = builder.Build();
app.UseCors();

// ← mac_linux_db_connection/connection_info.md のapp_schema接続情報。
//   Mac単体でOracleコンテナが起動している前提（localhost:1521/FREEPDB1）
const string ConnectionString = "User Id=app_schema;Password=app_schema;Data Source=localhost:1521/FREEPDB1;";

app.MapGet("/api/pages", () =>
{
    var pages = new List<Page>();

    using var connection = new OracleConnection(ConnectionString);
    connection.Open();

    using var command = connection.CreateCommand();
    // ← app_schemaはPagesの実体を持たず、data_schema.Pagesへのシノニム経由でアクセスしている
    command.CommandText = "SELECT id, title, content, parent_id FROM Pages ORDER BY id";

    using var reader = command.ExecuteReader();
    while (reader.Read())
    {
        pages.Add(new Page(
            // ❌ 誤解しやすい：OracleのNUMBER列を素朴に reader.GetInt32() で読めそうに見える
            // ✅ 正しくは：ODP.NETのOracleDataReaderはGetInt32を実装しており、
            //   NUMBER→Int32の変換を内部でハンドルしてくれるため実際に動く（要実機確認）
            reader.GetInt32(0),
            reader.GetString(1),
            // ← content(CLOB)がNULLの行がある可能性があるのでIsDBNullチェックが必要
            reader.IsDBNull(2) ? null : reader.GetString(2),
            reader.IsDBNull(3) ? null : reader.GetInt32(3)
        ));
    }

    return pages;
});

app.Run();

// ← System.Text.Jsonが出力時にcamelCase(id, title, content, parentId)へ自動変換する
record Page(int Id, string Title, string? Content, int? ParentId);
