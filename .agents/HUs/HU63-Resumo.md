# HU63 - Registros Pedagógicos – Documentação por Adolescente

> Resumo de entrega no padrão HU64. A especificação completa (descrição, RNs, apontamentos, arquivos e validação) permanece em `HU63.md`.

## Backend

### O que foi feito
Implementação do backend da funcionalidade Documentação por Adolescente, provendo os endpoints de pesquisa com filtros combinados na tabela `TB_DOCUMENTO_ADOLESCENTE` e o serviço de geração de relatório consolidado em PDF (via iText7). Inclui a criação da entidade, do repositório (Dapper), da migration e dos handlers CQRS.

### Comportamento implementado
- **RN01 / RN02 / RN03 / RN04 / RN05 / RN06** — Pesquisa na `TB_DOCUMENTO_ADOLESCENTE` com filtros de Região, Zona/Subregião, Centro, Módulo, Período de expedição (inicial/final), Tipo de documento, Via e Status, recuperando os domínios dos módulos Lotação e Adolescente.
- **RN07 / RN08 / RN09** — Retorno dos registros compatíveis, com validação de ao menos um filtro (`TemAoMenosUmFiltro`) e tratamento de ausência de resultados.
- **RN10 / RN11 / RN12** — Projeção dos campos do resultado, contagem total e paginação de 10 registros por página.
- **Filtros múltiplos** — Suporte a multi-seleção (split por vírgula, `IN (...)`) em Tipo de documento, Via e Status.
- **RN14 / RN15 / RN16 / RN17 / RN19 / RN20 / RN21** — Motor de geração do relatório PDF (iText7) com os filtros aplicados, dados dos adolescentes, agrupamento por sessão/documento em ordem cronológica decrescente, data/hora de emissão e numeração de páginas.

## Frontend

### O que foi feito
Implementação da interface de pesquisa e emissão de relatório da Documentação por Adolescente, com formulário de filtros integrado aos módulos Lotação e Adolescente, listagem paginada de resultados, disparo do relatório em PDF e padronização das mensagens via Toasts.

### Comportamento implementado
- **RN01 / RN02 / RN03 / RN04 / RN05 / RN06** — Filtros de pesquisa disponíveis (Região, Zona/Subregião, Centro, Módulo, Períodos, Tipo de documento, Via, Status) com listas populadas por integração.
- **RN07 / RN08 / RN09** — Exibição dos resultados ou das mensagens **MSG01** (nenhum filtro informado) e **MSG02** (sem resultados).
- **RN10 / RN11 / RN12** — Grid com as colunas do resultado, total de registros encontrados e paginação de 10 por página.
- **RN13 / RN14** — Botão "Gerar Relatório" habilitado após a pesquisa e integração para emissão do PDF.
- **Padronização de UI/UX** — Alertas e erros migrados para Toasts flutuantes (`_FlashMessagesToast`).
