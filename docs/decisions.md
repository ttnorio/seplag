
```md
# Decisões Arquiteturais

## ADR-001 — Banco normalizado

Decisão:
Utilizar modelagem normalizada para órgãos, programas, ações, funções, subfunções, fontes de recurso, naturezas da despesa, fornecedores, contratos e revisões.

Motivo:
Reduzir duplicidade, melhorar integridade dos dados e facilitar manutenção.

Consequência:
Mais relacionamentos e joins, porém maior qualidade estrutural.

## ADR-002 — MySQL

Decisão:
Utilizar MySQL como banco de dados.

Motivo:
Boa integração com Laravel, ampla adoção em aplicações web e simplicidade para execução via Docker.

## ADR-003 — Revisões em tabela própria

Decisão:
Criar a tabela `revisoes` em vez de armazenar apenas `revisado_por` e `data_revisao` diretamente em `orcamentos`.

Motivo:
Permitir histórico de auditoria e rastreabilidade das revisões realizadas pelos analistas.

## ADR-004 — Status persistido e recalculável

Decisão:
Persistir o campo `status` em `orcamentos`, mas centralizar sua regra em serviço de domínio.

Motivo:
Facilita filtros e consultas, mantendo a regra de classificação concentrada em um único ponto da aplicação.