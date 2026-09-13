# HU60 - Histórico ENEM e ENCCEJA do Adolescente (Integração FrontEnd)

> Resumo de entrega no padrão HU64. A especificação completa (descrição, BDD, RNs, arquivos e validação) permanece em `HU60.md`.

## Backend

### O que foi feito
Integração com os endpoints da API do módulo Adolescente responsáveis pela persistência do histórico de concursos (ENEM e ENCCEJA) na tabela `TB_CONCURSO`. Nesta HU não houve criação de API própria; o trabalho consistiu em consumir os endpoints de CRUD de concursos (`api/v1/adolescentes/{idAdolescente}/concursos`) e a coleção de centros de lotação, substituindo os dados mockados por dados reais.

### Comportamento implementado
- **RN05** — Persistência de concursos (criação, edição e exclusão) na `TB_CONCURSO`, contemplando os campos do exame (número de inscrição, data, centro, série, sistema de bolsas, flags de certificação/proficiência e notas).
- **RN01** — Cabeçalho de Dados Básicos (Nome, RA, PT, Data de Nascimento, Idade, Centro) consumido da integração com os módulos de Lotação e Adolescente.

## Frontend

### O que foi feito
Integração da aba "Concursos" dos Dados Escolares com a API real, removendo os dados mockados e implementando os fluxos de consulta, cadastro, edição e exclusão de participações em ENEM e ENCCEJA, com carregamento dinâmico dos centros de lotação e validação das notas.

### Comportamento implementado
- **RN01** — Campos em modo leitura do cabeçalho consumidos dos dados integrados (Lotação + Adolescente).
- **RN02** — Notas fracionadas com duas casas decimais (`step="0.01"`).
- **RN03** — Um mesmo adolescente pode participar dos dois concursos (ENEM e ENCCEJA).
- **RN04** — Nota máxima limitada a 1000 por matéria (`min`/`max` + validação `oninput`).
- **RN05** — Cadastro, edição e exclusão persistidos via API na `TB_CONCURSO`.
- **60.1 / 60.2 / 60.3** — Seleção única (Série Atual, Sistema de Bolsas), rádios de certificação/regularização e cálculo/exibição automáticos da média.
