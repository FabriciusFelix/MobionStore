---
name: criar-command-handler
description: Cria um Command com seu Handler seguindo o padrão CQRS com MediatR e ErrorOr usado nos módulos Memora
---

# Skill: Criar Command + CommandHandler

Use esta skill sempre que o usuário pedir para criar um **Command** ou **caso de uso de escrita** (cadastrar, atualizar, excluir, vincular).

## Estrutura de Pastas

```
Pedagogia.Application/
└── Commands/
    └── {Modulo}/
        └── {Entidade}/
            └── {Acao}{Entidade}/
                ├── {Acao}{Entidade}Command.cs
                └── {Acao}{Entidade}CommandHandler.cs
```

**Exemplo real:** `Commands/EducacaoFisicaEsporte/Atividades/CadastrarAtividade/`

## 1. Command (`{Acao}{Entidade}Command.cs`)

```csharp
using ErrorOr;
using MediatR;

namespace {Modulo}.Application.Commands.{Submodulo}.{Entidade}.{Acao}{Entidade}
{
    public sealed record {Acao}{Entidade}Command(
        // parâmetros do comando
        string Campo1,
        string Campo2) : IRequest<ErrorOr<Success>>;
        // ou IRequest<ErrorOr<MessageResponse>> se retornar mensagem
}
```

**Regras:**
- Sempre `sealed record`
- Implementa `IRequest<ErrorOr<T>>`
- `ErrorOr<Success>` para operações sem retorno (cadastrar, atualizar, excluir)
- `ErrorOr<MessageResponse>` para operações que retornam mensagem
- `ErrorOr<TipoRetorno>` para operações que retornam dados

## 2. CommandHandler (`{Acao}{Entidade}CommandHandler.cs`)

```csharp
using ErrorOr;
using MediatR;
using {Modulo}.Application.Features.{Submodulo}.{Entidade};
using {Modulo}.Domain.Entities;
using {Modulo}.Domain.Repositories;

namespace {Modulo}.Application.Commands.{Submodulo}.{Entidade}.{Acao}{Entidade}
{
    public sealed class {Acao}{Entidade}CommandHandler :
        IRequestHandler<{Acao}{Entidade}Command, ErrorOr<Success>>
    {
        private readonly I{Entidade}Repository _repository;

        public {Acao}{Entidade}CommandHandler(I{Entidade}Repository repository)
        {
            _repository = repository;
        }

        public async Task<ErrorOr<Success>> Handle(
            {Acao}{Entidade}Command request,
            CancellationToken cancellationToken)
        {
            // RN01: Validações de campo obrigatório
            if (string.IsNullOrWhiteSpace(request.Campo1))
            {
                return Error.Validation(
                    code: "{Entidade}.CampoObrigatorio",
                    description: {Entidade}Mensagens.CampoObrigatorio);
            }

            // RN02: Verificar unicidade
            var existe = await _repository.NomeExisteAsync(request.Campo1, cancellationToken);
            if (existe)
            {
                return Error.Conflict(
                    code: "{Entidade}.NomeJaCadastrado",
                    description: {Entidade}Mensagens.NomeJaCadastrado);
            }

            // Criar entidade
            var entidade = new {Entidade}
            {
                Campo1 = request.Campo1.Trim(),
                Campo2 = request.Campo2.Trim()
            };

            await _repository.AdicionarAsync(entidade, cancellationToken);

            return Result.Success;
        }
    }
}
```

**Regras do Handler:**
- Sempre `sealed class`
- Valide campos obrigatórios com `string.IsNullOrWhiteSpace`
- Retorne `Error.Validation` para erros de validação de negócio
- Retorne `Error.NotFound` quando entidade não encontrada
- Retorne `Error.Conflict` para duplicidade ou conflito
- **Nunca lance exceções** para erros de negócio
- Sempre `.Trim()` ao persistir strings vindas do request
- Comente as regras de negócio com `// RNxx:`

## 3. Após criar o Command+Handler

1. **Registrar no DI** não é necessário — MediatR descobre automaticamente via `RegisterServicesFromAssembly`.
2. **Criar o endpoint** no Controller correspondente (use a skill `criar-endpoint-controller`).
3. **Criar o teste** (use a skill `criar-teste-command-handler`).

## 4. Padrões de Retorno no Controller

```csharp
// Criação → 201 Created
if (result.IsError) return FromErrorOrMessage(result);
return Created(string.Empty, null);

// Atualização/Exclusão → 204 No Content
return FromErrorOrNoContent(result);

// Operação com mensagem → 200 OK com MessageResponse
return FromErrorOrMessage(result);
```
