---
name: criar-novo-modulo
description: Cria a estrutura completa de um novo módulo/funcionalidade nos projetos Memora seguindo o padrão Clean Architecture com CQRS
---

# Skill: Criar Novo Módulo ou Funcionalidade

Use esta skill quando o usuário pedir para criar uma nova funcionalidade, entidade ou módulo completo do zero.

## Checklist de Criação (ordem obrigatória)

Siga **sempre esta sequência** — camadas de baixo para cima:

```
1. Domain       → Entidade + Interface do Repositório + Mensagens
2. Infrastructure → Implementação do Repositório + Registro no DI
3. Application  → Command(s) + Query(ies) com Handlers
4. Api          → DTOs de Request + Response + Controller com Endpoints
5. Tests        → Testes de Commands e Queries
```

---

## Passo 1 — Domínio

### 1.1 Entidade (`Domain/Entities/{Entidade}.cs`)

```csharp
using SharedKernel.Entities;

namespace {Modulo}.Domain.Entities;

public sealed class {Entidade} : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string Campo2 { get; set; } = string.Empty;
    // BaseEntity já fornece: Id (long), CreatedAt, UpdatedAt, DeletedAt
}
```

### 1.2 Interface do Repositório
→ Use a skill `criar-repositorio`

### 1.3 Mensagens de Negócio (`Application/Features/{Submodulo}/{Entidade}/{Entidade}Mensagens.cs`)

```csharp
namespace {Modulo}.Application.Features.{Submodulo}.{Entidade};

internal static class {Entidade}Mensagens
{
    public const string CampoObrigatorio = "Nome e {campo2} são obrigatórios.";
    public const string NomeJaCadastrado = "{Entidade} já está cadastrada com este nome.";
    public const string NaoEncontrado    = "{Entidade} não encontrada.";
    public const string ExclusaoNaoPermitida = "Não é possível excluir {entidade} com vínculo ativo.";
}
```

---

## Passo 2 — Infrastructure

→ Use a skill `criar-repositorio` para o arquivo de implementação.

Lembre de registrar no `DependencyResolver.cs`:
```csharp
services.AddScoped<I{Entidade}Repository, {Entidade}Repository>();
```

---

## Passo 3 — Application

Para cada operação de **escrita** (cadastrar, atualizar, excluir):
→ Use a skill `criar-command-handler`

Para cada operação de **leitura** (pesquisar, obter, listar):
→ Use a skill `criar-query-handler`

**Operações típicas de um CRUD completo:**
| Operação | Tipo | Padrão de retorno |
|----------|------|-------------------|
| Cadastrar | Command | `ErrorOr<Success>` → 201 |
| Atualizar | Command | `ErrorOr<Success>` → 204 |
| Excluir | Command | `ErrorOr<Success>` → 204 |
| Pesquisar | Query | `ErrorOr<(int, IReadOnlyList<T>)>` → 200 paginado |
| Obter por ID | Query | `ErrorOr<{Entidade}>` → 200 |

---

## Passo 4 — API

Para os DTOs:
→ Use a skill `criar-dto-response`

Para os endpoints:
→ Use a skill `criar-endpoint-controller`

---

## Passo 5 — Testes

Para testes de Commands:
→ Use a skill `criar-teste-command-handler`

---

## Convenção de Namespace por Módulo

| Projeto | Namespace base |
|---------|----------------|
| Pedagogia | `Pedagogia.{Camada}.{Submodulo}` |
| Saude | `Saude.{Camada}.{Submodulo}` |
| Adolescente | `Adolescente.{Camada}.{Submodulo}` |
| Movimentacao | `Movimentacao.{Camada}.{Submodulo}` |
| SharedKernel | `SharedKernel.{Area}` |

## Submodulos existentes no Pedagogia (referência)

- `EducacaoFisicaEsporte`
- `AtividadePedagogica`
- `EnsinoSuperior`
- `EnsinoTecnico`
- `AtendimentoEscolar`
- `ArteCultura`

## Nomeação de Rotas da API

| Submodulo | Rota base |
|-----------|-----------|
| EducacaoFisicaEsporte | `api/v1/educacao-fisica` |
| AtividadePedagogica | `api/v1/atividade-pedagogica` |
| EnsinoSuperior | `api/v1/ensino-superior` |
| Novo módulo | `api/v1/{nome-kebab-case}` |
