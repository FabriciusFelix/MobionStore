---
name: criar-teste-command-handler
description: Cria testes unitários xUnit para CommandHandlers seguindo o padrão Fake Repository dos módulos Memora
---

# Skill: Criar Teste de CommandHandler

Use esta skill para criar testes unitários xUnit de CommandHandlers nos módulos Memora.

## Estrutura de Pastas

```
{Modulo}.Tests/
└── Application/
    └── Commands/
        └── {Submodulo}/
            └── {Entidade}CommandHandlerTests.cs
```

**Exemplo real:** `Tests/Application/Commands/EducacaoFisicaEsporte/EducacaoFisicaEsporteAtividadeCommandHandlerTests.cs`

---

## Template de Arquivo de Teste

```csharp
using ErrorOr;
using {Modulo}.Application.Commands.{Submodulo}.{Entidade}.Cadastrar{Entidade};
using {Modulo}.Application.Commands.{Submodulo}.{Entidade}.Atualizar{Entidade};
using {Modulo}.Application.Commands.{Submodulo}.{Entidade}.Excluir{Entidade};
using {Modulo}.Application.Features.{Submodulo}.{Entidade};
using {Modulo}.Domain.Entities;
using {Modulo}.Domain.Repositories;

namespace {Modulo}.Tests.Application.Commands.{Submodulo};

public sealed class {Entidade}CommandHandlerTests
{
    // ──────────────────────────────────────────────────────────────
    // Cadastrar{Entidade} — RN01: Campos obrigatórios
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Cadastrar_DeveRetornarErroQuandoCampoNaoInformado()
    {
        var repository = new {Entidade}RepositoryFake();
        var handler = new Cadastrar{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Cadastrar{Entidade}Command(string.Empty, "valor2"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorType.Validation, result.FirstError.Type);
        Assert.Equal({Entidade}Mensagens.CampoObrigatorio, result.FirstError.Description);
    }

    // ──────────────────────────────────────────────────────────────
    // Cadastrar{Entidade} — RN02: Nome único
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Cadastrar_DeveImpedirCadastroComNomeDuplicado()
    {
        var repository = new {Entidade}RepositoryFake();
        repository.Adicionar(new {Entidade} { Id = 1, Nome = "Existente" });

        var handler = new Cadastrar{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Cadastrar{Entidade}Command("Existente", "valor2"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorType.Conflict, result.FirstError.Type);
        Assert.Equal({Entidade}Mensagens.NomeJaCadastrado, result.FirstError.Description);
    }

    // ──────────────────────────────────────────────────────────────
    // Cadastrar{Entidade} — RN03: Cadastro com sucesso
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Cadastrar_DeveCadastrarComSucesso()
    {
        var repository = new {Entidade}RepositoryFake();
        var handler = new Cadastrar{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Cadastrar{Entidade}Command("Novo Nome", "valor2"),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(repository.Itens);
        Assert.Equal("Novo Nome", repository.Itens[0].Nome);
    }

    [Fact]
    public async Task Cadastrar_DeveTrimmarEspacosDosTextos()
    {
        var repository = new {Entidade}RepositoryFake();
        var handler = new Cadastrar{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Cadastrar{Entidade}Command("  Nome  ", "  valor2  "),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal("Nome", repository.Itens[0].Nome);
    }

    // ──────────────────────────────────────────────────────────────
    // Atualizar{Entidade}
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Atualizar_DeveAtualizarComSucesso()
    {
        var repository = new {Entidade}RepositoryFake();
        repository.Adicionar(new {Entidade} { Id = 1, Nome = "Original" });

        var handler = new Atualizar{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Atualizar{Entidade}Command(1, "Atualizado", "novo valor2"),
            CancellationToken.None);

        Assert.False(result.IsError);
        var entidade = repository.ObterPorId(1);
        Assert.Equal("Atualizado", entidade!.Nome);
        Assert.NotNull(entidade.UpdatedAt);
    }

    [Fact]
    public async Task Atualizar_DeveRetornarNotFoundParaIdInexistente()
    {
        var repository = new {Entidade}RepositoryFake();
        var handler = new Atualizar{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Atualizar{Entidade}Command(999, "Nome", "valor2"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorType.NotFound, result.FirstError.Type);
        Assert.Equal({Entidade}Mensagens.NaoEncontrado, result.FirstError.Description);
    }

    // ──────────────────────────────────────────────────────────────
    // Excluir{Entidade}
    // ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Excluir_DeveExcluirComSucesso()
    {
        var repository = new {Entidade}RepositoryFake();
        repository.Adicionar(new {Entidade} { Id = 1, Nome = "Para Excluir" });

        var handler = new Excluir{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Excluir{Entidade}Command(1),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Null(repository.ObterPorId(1));
    }

    [Fact]
    public async Task Excluir_DeveImpedirExclusaoComVinculoAtivo()
    {
        var repository = new {Entidade}RepositoryFake();
        repository.Adicionar(new {Entidade} { Id = 1, Nome = "Vinculada" });
        repository.AdicionarVinculo(1);

        var handler = new Excluir{Entidade}CommandHandler(repository);

        var result = await handler.Handle(
            new Excluir{Entidade}Command(1),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal(ErrorType.Validation, result.FirstError.Type);
        Assert.Equal({Entidade}Mensagens.ExclusaoNaoPermitida, result.FirstError.Description);
        Assert.NotNull(repository.ObterPorId(1)); // não foi excluída
    }

    // ──────────────────────────────────────────────────────────────
    // Fake Repository
    // ──────────────────────────────────────────────────────────────

    private sealed class {Entidade}RepositoryFake : I{Entidade}Repository
    {
        private readonly List<{Entidade}> _itens = new();
        private readonly HashSet<long> _comVinculo = new();

        public List<{Entidade}> Itens => _itens;

        public void Adicionar({Entidade} entidade) => _itens.Add(entidade);
        public void AdicionarVinculo(long id) => _comVinculo.Add(id);
        public {Entidade}? ObterPorId(long id) => _itens.FirstOrDefault(e => e.Id == id);

        public Task<bool> NomeExisteAsync(string nome, CancellationToken cancellationToken) =>
            Task.FromResult(_itens.Any(e =>
                e.Nome.Equals(nome, StringComparison.OrdinalIgnoreCase) &&
                e.DeletedAt == null));

        public Task<{Entidade}?> ObterPorIdAsync(long id, CancellationToken cancellationToken) =>
            Task.FromResult(_itens.FirstOrDefault(e => e.Id == id));

        public Task AdicionarAsync({Entidade} entidade, CancellationToken cancellationToken)
        {
            _itens.Add(entidade);
            return Task.CompletedTask;
        }

        public Task AtualizarAsync({Entidade} entidade, CancellationToken cancellationToken) =>
            Task.CompletedTask;

        public Task ExcluirAsync({Entidade} entidade, CancellationToken cancellationToken)
        {
            _itens.Remove(entidade);
            return Task.CompletedTask;
        }

        public Task<bool> PossuiVinculoAsync(long id, CancellationToken cancellationToken) =>
            Task.FromResult(_comVinculo.Contains(id));

        public Task<(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)> PesquisarAsync(
            string? filtro, int pagina, int quantidade, CancellationToken cancellationToken) =>
            Task.FromResult<(int, IReadOnlyList<{Entidade}>)>((0, Array.Empty<{Entidade}>()));
    }
}
```

---

## Convenções de Teste

| Aspecto | Padrão |
|---------|--------|
| Nome do método | `{Acao}_{Condicao}_{Resultado}` em português |
| Arrange | Cria `RepositoryFake`, configura estado, instancia `Handler` |
| Act | Chama `handler.Handle(command, CancellationToken.None)` |
| Assert erro | `Assert.True(result.IsError)` + verifica `ErrorType` + `Description` |
| Assert sucesso | `Assert.False(result.IsError)` + verifica estado do fake |
| Fake | `private sealed class` dentro da classe de teste |

## Seções de Comentário

```csharp
// ──────────────────────────────────────────────────────────────
// NomeDaRegra — RNxx: Descrição da regra (HUxx)
// ──────────────────────────────────────────────────────────────
```

## Tipos de Erro para Verificar

```csharp
Assert.Equal(ErrorType.Validation, result.FirstError.Type);  // campo inválido, regra violada
Assert.Equal(ErrorType.NotFound,   result.FirstError.Type);  // entidade não encontrada
Assert.Equal(ErrorType.Conflict,   result.FirstError.Type);  // duplicidade, já vinculado
```
