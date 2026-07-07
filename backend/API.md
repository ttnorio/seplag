# API - Sistema de Acompanhamento da Execução Orçamentária

Base URL local:

```txt
http://127.0.0.1:8000/api
```

---

## Autenticação

A API utiliza Laravel Sanctum com Bearer Token.

Usuário de teste:

```txt
E-mail: analista@seplag.rj.gov.br
Senha: orcamento@2026
```

### POST /auth/login

Autentica o usuário e retorna um token de acesso.

Body:

```json
{
  "email": "analista@seplag.rj.gov.br",
  "password": "orcamento@2026"
}
```

Resposta:

```json
{
  "token_type": "Bearer",
  "access_token": "...",
  "expires_at": "2026-07-08T02:26:09.765376Z",
  "user": {
    "id": 1,
    "name": "Analista SEPLAG",
    "email": "analista@seplag.rj.gov.br",
    "preferred_username": "analista@seplag.rj.gov.br"
  }
}
```

### GET /auth/me

Retorna o usuário autenticado.

Requer Bearer Token.

### POST /auth/logout

Revoga o token atual.

Requer Bearer Token.

---

## Dashboard

### GET /dashboard

Retorna os principais indicadores do painel.

Exemplo de resposta:

```json
{
  "total_orgaos": 20,
  "total_orcamentos": 500,
  "total_contratos": 300,
  "orcamento_total": 1419084351,
  "empenhado": 851191837.49,
  "liquidado": 615200711.2,
  "pago": 467687191.82,
  "saldo": 567892513.51,
  "percentual_execucao": 59.98,
  "total_revisados": 120,
  "total_nao_revisados": 380
}
```

---

## Órgãos

### GET /orgaos

Lista órgãos com paginação.

Filtros disponíveis:

```txt
busca
status
per_page
page
```

Exemplos:

```txt
GET /orgaos
GET /orgaos?status=ativo
GET /orgaos?busca=SEPLAG
GET /orgaos?busca=se&status=ativo&per_page=5
```

---

## Orçamentos

### GET /orcamentos

Lista registros orçamentários com paginação e relacionamentos principais.

Filtros disponíveis:

```txt
orgao_id
programa_id
acao_id
ano
status
percentual_min
percentual_max
per_page
page
```

Exemplos:

```txt
GET /orcamentos
GET /orcamentos?per_page=5
GET /orcamentos?status=inconsistente
GET /orcamentos?ano=2026
GET /orcamentos?percentual_min=50&percentual_max=80
```

### GET /orcamentos/{id}

Retorna o detalhamento completo de um orçamento, incluindo:

```txt
órgão
unidade gestora
programa
ação
função
subfunção
natureza da despesa
fonte de recurso
contratos vinculados
revisões
```

Exemplos:

```txt
GET /orcamentos/1
GET /orcamentos/250
```

### PATCH /orcamentos/{id}/revisao

Marca um orçamento como revisado pelo analista autenticado.

Requer Bearer Token.

Body:

```json
{
  "observacao": "Revisado durante teste da API."
}
```

Resposta:

```json
{
  "message": "Orçamento marcado como revisado.",
  "orcamento_id": 250,
  "revisao": {
    "orcamento_id": 250,
    "user_id": 1,
    "observacao": "Revisado durante teste da API."
  }
}
```

---

## Contratos

### GET /contratos

Lista contratos vinculados aos orçamentos.

Filtros disponíveis:

```txt
orgao_id
status
fornecedor
per_page
page
```

Exemplos:

```txt
GET /contratos
GET /contratos?status=vigente
GET /contratos?status=vencido
GET /contratos?fornecedor=Alpha
GET /contratos?orgao_id=1
```

---

## Gráficos

### GET /graficos

Retorna dados agregados para gráficos.

Inclui:

```txt
execucao_por_orgao
execucao_por_programa
empenhado_x_pago
top_10_contratos
evolucao_anual
orcamentos_por_status
contratos_por_status
```

---

## Rotas protegidas

As seguintes rotas exigem autenticação via Bearer Token:

```txt
GET /auth/me
POST /auth/logout
PATCH /orcamentos/{id}/revisao
```

---

## Observações técnicas

A autenticação foi implementada com Laravel Sanctum utilizando tokens Bearer.

O desafio permite o uso de Laravel Sanctum ou JWT Auth. A estratégia adotada foi utilizar Sanctum pela integração nativa com Laravel, simplicidade de implementação e suporte a expiração de tokens.

O token possui expiração configurada para 8 horas. Após expirar, o frontend deverá redirecionar o usuário para realizar login novamente.

O campo `preferred_username` é retornado junto aos dados do usuário autenticado, usando o e-mail do analista.