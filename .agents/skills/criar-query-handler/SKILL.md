---
name: criar-query-handler
description: Cria uma Query com seu Handler seguindo o padrão CQRS com MediatR e ErrorOr usado nos módulos Memora
---

# Skill: Criar Query + QueryHandler

Use esta skill sempre que o usuário pedir para criar uma **Query** ou **caso de uso de leitura** (pesquisar, obter, listar).

## Estrutura de Pastas

```
Pedagogia.Application/
└── Queries/
    └── {Modulo}/
        └── {Entidade}/
            └── {Acao}{Entidade}/
                ├── {Acao}{Entidade}Query.cs
                └── {Acao}{Entidade}QueryHandler.cs
```

**Exemplo real:** `Queries/EducacaoFisicaEsporte/Atividades/PesquisarAtividades/`

## 1. Query Simples — Obter por ID

```csharp
using ErrorOr;
using MediatR;

namespace {Modulo}.Application.Queries.{Submodulo}.{Entidade}.Obter{Entidade}
{
    public sealed record Obter{Entidade}Query(long Id) : IRequest<ErrorOr<{Entidade}>>;
}
```

## 2. Query com Paginação — Pesquisar

```csharp
using ErrorOr;
using MediatR;

namespace {Modulo}.Application.Queries.{Submodulo}.{Entidade}.Pesquisar{Entidades}
{
    public sealed record Pesquisar{Entidades}Query(
        string? Filtro1,
        string? Filtro2,
        int Pagina,
        int QuantidadeRegistros) : IRequest<ErrorOr<(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)>>;
}
```

## 3. QueryHandler — Obter por ID

```csharp
using ErrorOr;
using MediatR;
using {Modulo}.Domain.Entities;
using {Modulo}.Domain.Repositories;

namespace {Modulo}.Application.Queries.{Submodulo}.{Entidade}.Obter{Entidade}
{
    public sealed class Obter{Entidade}QueryHandler :
        IRequestHandler<Obter{Entidade}Query, ErrorOr<{Entidade}>>
    {
        private readonly I{Entidade}Repository _repository;

        public Obter{Entidade}QueryHandler(I{Entidade}Repository repository)
        {
            _repository = repository;
        }

        public async Task<ErrorOr<{Entidade}>> Handle(
            Obter{Entidade}Query request,
            CancellationToken cancellationToken)
        {
            var entidade = await _repository.ObterPorIdAsync(request.Id, cancellationToken);

            if (entidade is null)
                return Error.NotFound(
                    code: "{Entidade}.NaoEncontrada",
                    description: {Entidade}Mensagens.NaoEncontrada);

            return entidade;
        }
    }
}
```

## 4. QueryHandler — Pesquisar com Paginação

```csharp
using ErrorOr;
using MediatR;
using {Modulo}.Domain.Entities;
using {Modulo}.Domain.Repositories;

namespace {Modulo}.Application.Queries.{Submodulo}.{Entidade}.Pesquisar{Entidades}
{
    public sealed class Pesquisar{Entidades}QueryHandler :
        IRequestHandler<Pesquisar{Entidades}Query, ErrorOr<(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)>>
    {
        private readonly I{Entidade}Repository _repository;

        public Pesquisar{Entidades}QueryHandler(I{Entidade}Repository repository)
        {
            _repository = repository;
        }

        public async Task<ErrorOr<(int TotalRegistros, IReadOnlyList<{Entidade}> Itens)>> Handle(
            Pesquisar{Entidades}Query request,
            CancellationToken cancellationToken)
        {
            // Pelo menos um filtro deve ser informado (se aplicável)
            if (string.IsNullOrWhiteSpace(request.Filtro1) && string.IsNullOrWhiteSpace(request.Filtro2))
                return Error.Validation(
                    code: "{Entidade}.FiltroObrigatorio",
                    description: {Entidade}Mensagens.FiltroObrigatorio);

            var resultado = await _repository.PesquisarAsync(
                request.Filtro1,
                request.Filtro2,
                request.Pagina,
                request.QuantidadeRegistros,
                cancellationToken);

            return resultado;
        }
    }
}
```

## 5. Como expor no Controller (com paginação)

```csharp
[HttpGet("entidade")]
[SwaggerOperation(Summary = "Pesquisa {entidades} com paginação.")]
[ProducesResponseType(typeof(PagedResponse<{Entidade}ListResponse>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> Pesquisar(
    [FromQuery] string? filtro1,
    [FromQuery] string? filtro2,
    [FromQuery] int Page = 1,
    [FromQuery] int PageSize = 10,
    CancellationToken cancellationToken = default)
{
    var result = await _mediator.Send(
        new Pesquisar{Entidades}Query(filtro1, filtro2, Page > 0 ? Page : 1, PageSize > 0 ? PageSize : 10),
        cancellationToken);

    if (result.IsError)
        return FromErrorOrMessage(result);

    var pagedResponse = new PagedResponse<{Entidade}ListResponse>
    {
        Items = result.Value.Itens.Select(e => new {Entidade}ListResponse
        {
            Id = e.Id,
            // ... mapear campos
        }).ToList(),
        TotalCount = result.Value.TotalRegistros,
        CurrentPage = Page > 0 ? Page : 1,
        PageSize = PageSize > 0 ? PageSize : 10
    };

    return Ok(pagedResponse);
}
```

## Checklist após criar Query

- [ ] Query criada com `sealed record`
- [ ] QueryHandler criado com `sealed class`
- [ ] Handler retorna `ErrorOr<T>` correto
- [ ] `Error.NotFound` quando entidade não existe
- [ ] `Error.Validation` quando filtros inválidos
- [ ] Endpoint criado no Controller (use skill `criar-endpoint-controller`)
- [ ] DTO de response criado (use skill `criar-dto-response`)
- [ ] Teste criado (use skill `criar-teste-query-handler`)
