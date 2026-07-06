## Entidade central

A entidade central do domínio é `Orcamento`.

Um orçamento representa uma autorização de gasto vinculada a órgão, unidade gestora, programa, ação, função, subfunção, natureza da despesa e fonte de recurso.

```mermaid
erDiagram
    USERS ||--o{ REVISOES : realiza

    ORGAOS ||--o{ UNIDADES_GESTORAS : possui
    ORGAOS ||--o{ ORCAMENTOS : possui

    PROGRAMAS ||--o{ ACOES : possui
    PROGRAMAS ||--o{ ORCAMENTOS : classifica
    ACOES ||--o{ ORCAMENTOS : detalha

    FUNCOES ||--o{ SUBFUNCOES : possui
    FUNCOES ||--o{ ORCAMENTOS : classifica
    SUBFUNCOES ||--o{ ORCAMENTOS : detalha

    NATUREZAS_DESPESA ||--o{ ORCAMENTOS : classifica
    FONTES_RECURSO ||--o{ ORCAMENTOS : financia

    ORCAMENTOS ||--o{ CONTRATOS : possui
    FORNECEDORES ||--o{ CONTRATOS : fornece

    ORCAMENTOS ||--o{ REVISOES : possui