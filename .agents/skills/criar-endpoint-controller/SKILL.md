---
name: criar-endpoint-controller
description: Cria endpoints em um Controller C# da API seguindo o padrão dos módulos Memora com MediatR, Swagger e ErrorOr
---

# Skill: Criar Endpoint no Controller

Use esta skill ao adicionar endpoints em um Controller API dos módulos Memora.

## Estrutura do Controller

```csharp
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
// ... outros usings

namespace {Modulo}.Api.Controllers.v1
{
    [ApiController]
    [Route("api/v1/{rota-do-modulo}")]
    public sealed class {Entidade}Controller : PedagogiaApiController
    {
        public {Entidade}Controller(IMediator mediator) : base(mediator)
        {
        }

        // Endpoints aqui...
    }
}
```

**Regras do Controller:**
- Herdar de `PedagogiaApiController` (ou equivalente do módulo)
- Injetar **apenas** `IMediator` no construtor
- `sealed class`
- Rota no formato `kebab-case`: `api/v1/educacao-fisica`
- Versão `v1` obrigatória na rota

---

## Padrões de Endpoint

### POST — Cadastrar (retorna 201 Created)

```csharp
/// <summary>
/// Cadastra um(a) {Entidade}.
/// </summary>
[HttpPost("{entidade}")]
[SwaggerOperation(Summary = "Cadastra um(a) {Entidade}.")]
[ProducesResponseType(StatusCodes.Status201Created)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status409Conflict)]
public async Task<IActionResult> Cadastrar(
    [FromBody] Criar{Entidade}Request request,
    CancellationToken cancellationToken)
{
    var result = await _mediator.Send(
        new Cadastrar{Entidade}Command(request.Campo1, request.Campo2),
        cancellationToken);

    if (result.IsError)
        return FromErrorOrMessage(result);

    return Created(string.Empty, null);
}
```

### GET — Pesquisar com Paginação (retorna 200 com PagedResponse)

```csharp
/// <summary>
/// Pesquisa {entidades} com paginação.
/// </summary>
[HttpGet("{entidade}")]
[SwaggerOperation(Summary = "Pesquisa {entidades}.")]
[ProducesResponseType(typeof(PagedResponse<{Entidade}ListResponse>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
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
            // ... campos
        }).ToList(),
        TotalCount = result.Value.TotalRegistros,
        CurrentPage = Page > 0 ? Page : 1,
        PageSize = PageSize > 0 ? PageSize : 10
    };

    return Ok(pagedResponse);
}
```

### GET — Obter por ID (retorna 200 com Response)

```csharp
/// <summary>
/// Obtém os detalhes de um(a) {Entidade} por ID.
/// </summary>
[HttpGet("{entidade}/{id:long}")]
[SwaggerOperation(Summary = "Obtém detalhes de um(a) {Entidade}.")]
[ProducesResponseType(typeof({Entidade}DetalheResponse), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> Obter(
    [FromRoute] long id,
    CancellationToken cancellationToken)
{
    var result = await _mediator.Send(
        new Obter{Entidade}Query(id),
        cancellationToken);

    if (result.IsError)
        return FromErrorOrMessage(result);

    var e = result.Value;

    var response = new {Entidade}DetalheResponse
    {
        Id = e.Id,
        // ... mapear campos
    };

    return Ok(response);
}
```

### PUT — Atualizar (retorna 204 No Content)

```csharp
/// <summary>
/// Atualiza os dados de um(a) {Entidade}.
/// </summary>
[HttpPut("{entidade}/{id:long}")]
[SwaggerOperation(Summary = "Atualiza os dados de um(a) {Entidade}.")]
[ProducesResponseType(StatusCodes.Status204NoContent)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> Atualizar(
    [FromRoute] long id,
    [FromBody] Atualizar{Entidade}Request request,
    CancellationToken cancellationToken)
{
    var result = await _mediator.Send(
        new Atualizar{Entidade}Command(id, request.Campo1, request.Campo2),
        cancellationToken);

    return FromErrorOrNoContent(result);
}
```

### DELETE — Excluir (retorna 204 No Content)

```csharp
/// <summary>
/// Exclui um(a) {Entidade}.
/// Não é permitida a exclusão se houver vínculo ativo.
/// </summary>
[HttpDelete("{entidade}/{id:long}")]
[SwaggerOperation(Summary = "Exclui um(a) {Entidade}.")]
[ProducesResponseType(StatusCodes.Status204NoContent)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> Excluir(
    [FromRoute] long id,
    CancellationToken cancellationToken)
{
    var result = await _mediator.Send(
        new Excluir{Entidade}Command(id),
        cancellationToken);

    return FromErrorOrNoContent(result);
}
```

---

## Métodos Auxiliares de Retorno

| Método | Quando usar |
|--------|-------------|
| `FromErrorOrNoContent(result)` | PUT, DELETE sem corpo de retorno → 204 |
| `FromErrorOrMessage(result)` | POST/GET quando retorna mensagem ou erros |
| `FromErrorOr(result)` | GET simples com dados → passa o valor direto |

## Organização com Seções

Use comentários de seção para organizar grupos de endpoints:

```csharp
// ─── Atividades ───────────────────────────────────────────────────────────────

// ... endpoints de atividades

// ─── Profissionais ────────────────────────────────────────────────────────────

// ... endpoints de profissionais
```
