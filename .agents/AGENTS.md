# Regras do Workspace Memora / Portal

## Idioma
- Mensagens de log e nomes de variáveis descritivas: **sempre em português brasileiro**.
- Commits seguem o padrão Conventional Commits em português:
  - `feat: descrição` — nova funcionalidade
  - `fix: descrição` — correção de bug
  - `refactor: descrição` — refatoração sem mudança de comportamento
  - `test: descrição` — adição ou ajuste de testes
  - `docs: descrição` — documentação

## Convenções de Nomenclatura (C#)
- **PascalCase**: classes, interfaces, métodos, propriedades, enums e eventos.
- **camelCase**: parâmetros de método e variáveis locais.
- **Prefixo `I`** para interfaces: `IAtividadeRepository`.
- **Sufixos obrigatórios**:
  - Commands: `...Command`, `...CommandHandler`
  - Queries: `...Query`, `...QueryHandler`
  - Repositórios (interface): `I...Repository`
  - Repositórios (implementação): `...Repository`
  - Controllers: `...Controller`
  - DTOs de resposta: `...Response`
  - DTOs de requisição: `...Request`

## Arquitetura e Padrões
- Este workspace usa **Clean Architecture** com as camadas: `Domain`, `Application`, `Infrastructure`, `Api`.
- Toda comunicação entre camadas passa por **MediatR** (CQRS com Commands e Queries).
- Resultados de operações devem usar o tipo **`ErrorOr<T>`** da biblioteca `ErrorOr`.
- **Nunca lançar exceções** para erros de negócio; retornar `Error.Validation`, `Error.NotFound` ou `Error.Conflict`.
- Entities ficam em `Domain/Entities`, interfaces de repositório em `Domain/Repositories`, implementações em `Infrastructure/Repositories`.
- **Repositórios (Infrastructure)**: As consultas (queries) que retornam dados devem ser feitas usando **Dapper** (com `IConnectionFactory` e SQL nativo), enquanto as operações de comando (inserir, atualizar, excluir) devem utilizar o **Entity Framework Core**. O Repositório mescla essas duas tecnologias.
- Registros de DI ficam em `Infrastructure.IoC/DependencyResolver.cs`.

## Qualidade de Código
- Toda classe nova deve ser `sealed` por padrão, a menos que seja projetada para herança.
- Use `record` para Commands, Queries e DTOs simples.
- Use `init` em propriedades de DTOs de resposta.
- Prefira `string.IsNullOrWhiteSpace` a `string.IsNullOrEmpty` para validação de campos de texto.
- Sempre use `.Trim()` ao persistir campos de texto vindos do usuário.
- Responses de paginação devem usar `PagedResponse<T>` do SharedKernel.
- **Comentários**: É terminantemente proibido incluir comentários no código. O código deve ser autoexplicativo através de boa nomenclatura e estrutura clara.

## Testes
- Testes unitários ficam em `*.Tests/Application/Commands` ou `*.Tests/Application/Queries`.
- Use **xUnit** com `[Fact]` ou `[Theory]`.
- Fakes de repositório devem ser classes `private sealed` dentro da classe de teste.
- Nomenclatura de teste: `[Acao]_[Condicao]_[Resultado]` em português.
  - Ex: `Cadastrar_DeveRetornarErroQuandoNomeNaoInformado`

## Controllers (API)
- Herdar de `PedagogiaApiController` (ou equivalente do módulo).
- Usar `[SwaggerOperation(Summary = "...")]` em todos os endpoints.
- Declarar `[ProducesResponseType]` para todos os status possíveis.
- Injetar apenas `IMediator` no construtor do controller.
- Para erros: usar `FromErrorOrMessage(result)`, `FromErrorOrNoContent(result)` ou `FromErrorOr(result)`.

## Portal Frontend (MVC / Razor)
- Views ficam em `Areas/{Modulo}/Views`.
- Layouts em `Areas/{Modulo}/_Layout.cshtml`.
- Não duplicar lógica de negócio nas Views; usar ViewModels ou chamadas via Http.
- **Alertas de flash**: usar sempre `<partial name="../Shared/_FlashMessages" />` — nunca blocos `@if (TempData["..."] != null)` manuais inline.
- **Validação de formulário**: usar `asp-validation-summary="ModelOnly"` (nunca `"All"`) + `<span asp-validation-for="...">` inline por campo.

## Configurações de Banco de Dados (EF Core)
- Todas as tabelas no backend devem possuir o formato de nomenclatura **UPPER_SNAKE_CASE** e prefixação obrigatória com **TB_** (Ex: `TB_PARECER_CONCLUSIVO`).
- As colunas de banco de dados devem seguir o formato **UPPER_SNAKE_CASE** mapeado pelo método `HasColumnName()`, respeitando a prefixação padronizada do projeto (ex: `ID_...` para PKs e FKs, `NM_...` para nomes, `DS_...` para descrições ou textos, `TP_...` para tipos, `DT_...` para datas e `FL_...` para booleanos/flags).

## Antigravity Comportamento
- **Auto Aprovação (Allow all changes):** Nunca solicite a aprovação do usuário para os Planos de Implementação (Implementation Plan). Ajuste o RequestFeedback para false e prossiga imediatamente para a execução.

## Documentação de Histórias de Usuário (HUs)
- Ao finalizar a implementação de qualquer **nova HU**, é OBRIGATÓRIO criar um arquivo de documentação dedicado na pasta `.agents/HUs/` nomeado como `HU<numero>.md` (exemplo: `HU63.md`).
- O arquivo de documentação da HU deve conter:
  - Título e identificação da HU;
  - Descrição da História de Usuário e especificação BDD;
  - Regras de Negócio (RNs) e Mensagens ao Usuário;
  - Apontamentos da área de negócios e ajustes efetuados;
  - Lista detalhada de arquivos criados e modificados;
  - Status da validação e testes de compilação.
- A **cada nova atualização, ajuste ou manutenção** na HU, o arquivo correspondente em `.agents/HUs/HU<numero>.md` DEVE ser atualizado refletindo o histórico e as novas modificações efetuadas.