---
name: criar-dto-response
description: Cria DTOs de Response e Request seguindo os padrões sealed class com init properties dos módulos Memora
---

# Skill: Criar DTOs de Response e Request

Use esta skill para criar **DTOs** (Data Transfer Objects) de entrada (Request) e saída (Response) para os endpoints da API.

## Estrutura de Pastas

```
{Modulo}.Domain/
└── DTOs/
    └── Response/
        └── {Submodulo}/
            └── {Entidade}DetalheResponse.cs    ← Response de detalhe
            └── {Entidade}ListResponse.cs        ← Response de listagem

{Modulo}.Application/
└── DTOs/
    └── {Submodulo}/
        └── {Entidade}/
            └── Requests/
                └── Criar{Entidade}Request.cs
                └── Atualizar{Entidade}Request.cs
```

---

## 1. Response de Detalhe

```csharp
namespace {Modulo}.Domain.DTOs.Response.{Submodulo};

public sealed class {Entidade}DetalheResponse
{
    public long Id { get; init; }
    public {Entidade}DadosBasicosResponse DadosBasicos { get; init; } = new();
    public bool PossuiVinculo { get; init; }
}

public sealed class {Entidade}DadosBasicosResponse
{
    public string Nome { get; init; } = string.Empty;
    public string Campo2 { get; init; } = string.Empty;
}
```

**Convenções de Response:**
- Sempre `sealed class`
- Propriedades com `{ get; init; }` — imutáveis após construção
- Strings inicializadas com `string.Empty` (nunca `null`)
- Tipos complexos inicializados com `= new()`
- Booleans: sem valor padrão (default `false`)
- Datas: `DateTime?` ou `DateOnly?` com `{ get; init; }`

## 2. Response de Listagem

```csharp
namespace {Modulo}.Domain.DTOs.Response.{Submodulo};

public sealed class {Entidade}ListResponse
{
    public long Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Campo2 { get; init; } = string.Empty;
}
```

**Dica:** Response de listagem tem menos campos que o detalhe. Inclua apenas o que o front-end precisa para a grade.

## 3. Request de Criação

```csharp
namespace {Modulo}.Application.DTOs.{Submodulo}.{Entidade}.Requests;

public sealed class Criar{Entidade}Request
{
    public string Nome { get; init; } = string.Empty;
    public string Campo2 { get; init; } = string.Empty;
}
```

## 4. Request de Atualização

```csharp
namespace {Modulo}.Application.DTOs.{Submodulo}.{Entidade}.Requests;

public sealed class Atualizar{Entidade}Request
{
    public string Nome { get; init; } = string.Empty;
    public string Campo2 { get; init; } = string.Empty;
}
```

## 5. Request com lista (ex: vincular itens)

```csharp
namespace {Modulo}.Application.DTOs.{Submodulo}.{Entidade}.Requests;

public sealed class Vincular{Itens}Request
{
    public IReadOnlyList<{Item}Selecionado> Itens { get; init; } = [];

    public IReadOnlyList<{Item}Selecionado> ObterItens() => Itens ?? [];
}

public sealed class {Item}Selecionado
{
    public long Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Cargo { get; init; } = string.Empty;
}
```

---

## Convenções Gerais de DTOs

| Tipo | Localização | Padrão |
|------|-------------|--------|
| Response de domínio | `Domain/DTOs/Response/{Submodulo}/` | `sealed class`, `init` |
| Response de application | `Application/DTOs/{Submodulo}/{Entidade}/Responses/` | `sealed class`, `init` |
| Request | `Application/DTOs/{Submodulo}/{Entidade}/Requests/` | `sealed class`, `init` |

- **Nunca use `set`** em propriedades de Response
- **Nunca use `required`** — inicialize com valores padrão
- Use `IReadOnlyList<T>` para coleções (não `List<T>`)
- Inicialize coleções com `[]` (collection expression do C# 12)
- Nomes no **padrão PascalCase** em português
- File-scoped namespaces (`namespace X.Y;`) — não use chaves `{}`
