# HU76 - Registros Pedagógicos – Parecer Pedagógico Conclusivo — NIO-31080

> Resumo de entrega no padrão HU64. A especificação completa (descrição, BDD, RNs, histórico de manutenções, arquivos, validação e pendências) permanece em `HU76.md`.

## Backend

### O que foi feito
Implementação do backend da funcionalidade Parecer Pedagógico Conclusivo, provendo os endpoints de cadastro, consulta por ID, listagem paginada com filtros, atualização, exclusão lógica (individual e em conjunto) e geração do relatório em PDF (NIO-31080). A persistência é estruturada em `TB_PARECER_CONCLUSIVO` e `TB_PARECER_CONCLUSIVO_ITEM` (EF Core para comandos, Dapper para consultas).

### Comportamento implementado
- **RN03 / RN04** — Listagem paginada de pareceres com filtros combinados de Centro, Tipo de internação, Tipo de parecer, Nome, RA e PT, projetando também os itens (tipos) de cada parecer para exibição no grid.
- **RN07 / RN07.1 / RN07.2 / RN10 / RN11 / RN12 / RN14 / RN15** — Gravação do parecer com dados básicos e múltiplos itens (Tipo de internação, Tipo de parecer, texto e data), vinculados a um único adolescente, sem limite de itens.
- **RN17 / RN18** — Consulta por ID com todos os itens e atualização dos pareceres existentes.
- **RN19 / RN21 / RN23 / RN24** — Exclusão lógica individual de itens e exclusão em conjunto de todos os pareceres do registro.
- **RN25 / RN26 / RN27 / RN28 / RN29 / RN32** — Geração do PDF com dados básicos e detalhamento por parecer (tipos, texto e data), refletindo os dados no momento da emissão.

> Manutenção (2026-07-29): correção da listagem paginada para carregar e projetar os itens ativos de cada parecer, eliminando as colunas Tipo de internação e Tipo de parecer vazias no grid (RN04).

## Frontend

### O que foi feito
Implementação da interface do Parecer Pedagógico Conclusivo, contemplando a tela de consulta com filtros, o grid de resultados, o cadastro/edição com múltiplos blocos de parecer, a seleção de adolescente via modal e a emissão do relatório em PDF.

### Comportamento implementado
- **RN01 / RN02 / RN03 / RN05 / RN06** — Menu, tela de consulta com filtros (Centro, Tipo de internação, Tipo de parecer, Nome, RA, PT) e botões Pesquisar, Limpar campos e Cadastrar novo.
- **RN04** — Grid de resultados com Centro, Nome, RA, PT, Tipo de internação, Tipo de parecer e ação de visualização (lupa).
- **RN07 / RN08 / RN09 / RN10 / RN13** — Cadastro com dados básicos, seleção de adolescente por modal (busca por Nome/RA/PT) e múltiplos blocos de parecer adicionáveis.
- **RN11 / RN12 / RN16** — Parecer em texto livre, data preenchida automaticamente com a data corrente e mensagem "Parecer adicionado com sucesso".
- **RN17 / RN18 / RN19 / RN20 / RN22 / RN23 / RN24** — Visualização detalhada, edição, exclusão individual (lixeira) com confirmação e exclusão do conjunto.
- **RN25 / RN30 / RN31** — Botão "Gerar relatório" com download e impressão do PDF.

> Pendências conhecidas (detalhadas em `HU76.md`): busca de adolescente por RA e coluna RA no modal (em tratamento na spec `parecer-conclusivo-modal-adolescente-sem-resultado`), paginação do grid, ordenação cronológica no detalhe/PDF e controle de acesso (RN33).
