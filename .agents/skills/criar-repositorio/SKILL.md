---
name: criar-repositorio
description: Cria a interface e implementação de repositório seguindo o padrão usado nos módulos Memora com Dapper e EF Core
---

# Skill: Criar Interface + Implementação de Repositório

Use esta skill para criar a **interface de repositório** na camada Domain e a **implementação** na camada Infrastructure.

## Estrutura de Pastas

```
{Modulo}.Domain/
└── Repositories/
    └── I{Entidade}Repository.cs          ← Interface

{Modulo}.Infrastructure/
└── Repositories/
    └── {Entidade}Repository.cs           ← Implementação

{Modulo}.Infrastructure.IoC/
└── DependencyResolver.cs                 ← Registro no DI
```

## 1. Interface do Repositório (`I{Entidade}Repository.cs`)

```csharp
using {Modulo}.Domain.Entities;

namespace {Modulo}.Domain.Repositories
{
    public interface I{Entidade}Repository
    {
        // Leitura
        Task<{Entidade}?> ObterPorIdAsync(long id, CancellationToken cancellationToken);
        
        Task<(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)> PesquisarAsync(
            string? filtro,
            int pagina,
            int quantidadeRegistros,
            CancellationToken cancellationToken);

        Task<bool> NomeExisteAsync(string nome, CancellationToken cancellationToken);

        // Escrita
        Task AdicionarAsync({Entidade} entidade, CancellationToken cancellationToken);
        Task AtualizarAsync({Entidade} entidade, CancellationToken cancellationToken);
        Task ExcluirAsync({Entidade} entidade, CancellationToken cancellationToken);
    }
}
```

**Convenções da interface:**
- Todos os métodos são `async` → retornam `Task<T>`
- Métodos de leitura: prefixo `Obter`, `Pesquisar`, `Listar`, `Existe`, `Possui`
- Métodos de escrita: prefixo `Adicionar`, `Atualizar`, `Excluir`
- Retorno nulável `{Entidade}?` para buscas por ID (pode não encontrar)
- Paginação: retornar tupla `(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)`
- Verificação de unicidade: retornar `bool` (`NomeExisteAsync`, `PossuiAtendimentoVinculadoAsync`)

## 2. Implementação do Repositório (`{Entidade}Repository.cs`)

```csharp
using Dapper;
using {Modulo}.Domain.Entities;
using {Modulo}.Domain.Repositories;
using {Modulo}.Infrastructure.EF.Contexts;
using SharedKernel.Entities;

namespace {Modulo}.Infrastructure.Repositories
{
    public sealed class {Entidade}Repository : I{Entidade}Repository
    {
        private readonly {Modulo}DbContext _context;
        private readonly IConnectionFactory _connectionFactory;

        public {Entidade}Repository(
            {Modulo}DbContext context,
            IConnectionFactory connectionFactory)
        {
            _context = context;
            _connectionFactory = connectionFactory;
        }

        // ─── Leitura (Dapper) ─────────────────────────────────────────────

        public async Task<{Entidade}?> ObterPorIdAsync(long id, CancellationToken cancellationToken)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = """
                SELECT Id, Campo1, Campo2, CreatedAt, UpdatedAt
                FROM dbo.{NomeTabela}
                WHERE Id = @Id
                  AND DeletedAt IS NULL
                """;

            return await connection.QueryFirstOrDefaultAsync<{Entidade}>(sql, new { Id = id });
        }

        public async Task<(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)> PesquisarAsync(
            string? filtro,
            int pagina,
            int quantidadeRegistros,
            CancellationToken cancellationToken)
        {
            using var connection = _connectionFactory.CreateConnection();
            var offset = (pagina - 1) * quantidadeRegistros;

            const string sql = """
                SELECT COUNT(*) OVER() AS TotalRegistros,
                       Id, Campo1, Campo2
                FROM dbo.{NomeTabela}
                WHERE DeletedAt IS NULL
                  AND (@Filtro IS NULL OR Campo1 LIKE '%' + @Filtro + '%')
                ORDER BY Campo1
                OFFSET @Offset ROWS FETCH NEXT @Quantidade ROWS ONLY
                """;

            var rows = await connection.QueryAsync<dynamic>(sql, new
            {
                Filtro = filtro,
                Offset = offset,
                Quantidade = quantidadeRegistros
            });

            var lista = rows.ToList();
            if (lista.Count == 0)
                return (0, Array.Empty<{Entidade}>());

            int total = (int)lista[0].TotalRegistros;
            var itens = lista.Select(r => new {Entidade}
            {
                Id = (long)r.Id,
                Campo1 = (string)r.Campo1
            }).ToList();

            return (total, itens);
        }

        public async Task<bool> NomeExisteAsync(string nome, CancellationToken cancellationToken)
        {
            using var connection = _connectionFactory.CreateConnection();

            const string sql = """
                SELECT COUNT(1) FROM dbo.{NomeTabela}
                WHERE Campo1 = @Nome AND DeletedAt IS NULL
                """;

            var count = await connection.ExecuteScalarAsync<int>(sql, new { Nome = nome });
            return count > 0;
        }

        // ─── Escrita (EF Core) ────────────────────────────────────────────

        public async Task AdicionarAsync({Entidade} entidade, CancellationToken cancellationToken)
        {
            await _context.Set<{Entidade}>().AddAsync(entidade, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task AtualizarAsync({Entidade} entidade, CancellationToken cancellationToken)
        {
            entidade.UpdatedAt = DateTime.UtcNow;
            _context.Set<{Entidade}>().Update(entidade);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task ExcluirAsync({Entidade} entidade, CancellationToken cancellationToken)
        {
            entidade.DeletedAt = DateTime.UtcNow;
            _context.Set<{Entidade}>().Update(entidade);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
```

**Convenções da implementação:**
- **Leituras → Dapper** via `IConnectionFactory` (performance)
- **Escritas → EF Core** via `DbContext` (rastreamento de entidade)
- Soft delete: nunca `DELETE` físico — setar `DeletedAt = DateTime.UtcNow`
- Filtrar registros excluídos: `WHERE DeletedAt IS NULL`
- Paginação: `OFFSET ... ROWS FETCH NEXT ... ROWS ONLY`
- Usar `COUNT(*) OVER()` para total sem segunda consulta

## 3. Registrar no DI (`DependencyResolver.cs`)

No método `AddBancoDeDados` ou `AddServices`:

```csharp
services.AddScoped<I{Entidade}Repository, {Entidade}Repository>();
```
