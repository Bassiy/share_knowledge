# レイヤードアーキテクチャ（N層アーキテクチャ）

## 概要
アプリケーションをApi（Controller）・Business・DataAccessのような責務ごとの層に分割し、各層が自分の使うインターフェースを自分で所有する形で実装するアーキテクチャパターン。

## 理解したこと

### 実務で見た構成（C#.NET）

```
Solution
│
├── Api/
│   ├── Controllers/
│   │   └── UserController.cs     # IUserService を呼ぶ
│   └── Program.cs                # DI登録（結線役）
│
├── Business/
│   ├── Interfaces/
│   │   └── IUserService.cs
│   └── UserService.cs            # IUserService実装。DataAccessのIUserRepositoryに依存
│
└── DataAccess/
    ├── Interfaces/
    │   └── IUserRepository.cs    # DataAccess自身が自分の契約を定義
    └── UserRepository.cs         # IUserRepositoryを実装
```

フロントエンドの`useApiRequest('/api/users')`のようなリクエストは、`[HttpPost]`などの属性が付いたControllerのメソッドに届く。

```csharp
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        this._userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }
}
```

---

Business層は「目的（ドメイン）ごとに1ファイル」で分割され（UserService.cs、OrderService.csなど）、必要なDataAccessのインターフェースをコンストラクタで受け取ってメソッドを使う。

```csharp
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        this._userRepository = userRepository;
    }
}
```

---

### Clean Architectureとの違い：インターフェースを誰が持つか
「インターフェースがある＝Clean Architecture」ではない。決定的な違いはインターフェースの所有者。

| | レイヤードアーキテクチャ（今回） | Clean/Onion Architecture |
|---|---|---|
| `IUserRepository`の所有者 | 実装する側（DataAccess自身） | 利用する側（Business/Domain中心） |
| Businessの依存 | DataAccessプロジェクトに依存する | 何にも依存しない |
| DB実装を差し替えた時 | Businessの再ビルドが必要 | Business無傷 |

依存の向き：`Api → Business → DataAccess`（一方向。BusinessはDataAccessの`IUserRepository`型を使うため、DataAccessプロジェクトへの参照を持つ）

---

## 関連概念
- solid_principles.md（DIP＝依存性逆転の原則が、Clean Architecture側の「インターフェースを中心が持つ」の理論的根拠）
- asp_net_mvc.md（同じくController/Model分割を持つが、SSRのRazor構文・View層まで含む別の実装パターン）
- container_presentational_pattern.md（同じプロジェクトのフロントエンド側の構成）

## ソース
- 2026-08-22・会話ベース（実務で見たC#.NETプロジェクトの言語化）

## タグ
アーキテクチャ, レイヤードアーキテクチャ, N層アーキテクチャ, C#, DI, 依存性逆転, Clean Architecture, DataAccess
