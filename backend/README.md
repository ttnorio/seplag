# SEPLAG - Sistema de Acompanhamento da Execução Orçamentária

Desafio técnico para desenvolvimento de um painel web de acompanhamento da execução orçamentária pública.

O objetivo do sistema é centralizar informações de orçamento, execução da despesa, contratos vinculados e revisões realizadas por analistas, permitindo uma visão simples e rápida da execução orçamentária dos órgãos estaduais.

## Estrutura do projeto

```bash
seplag/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
└── README.md
```

## Status atual do projeto

Backend Laravel implementado com:

- Migrations
- Models e relacionamentos
- Seeders
- Base fictícia populada automaticamente
- Autenticação via Bearer Token com Laravel Sanctum
- Endpoints principais da API
- Rotas protegidas por autenticação
- Documentação da API em `backend/API.md`

Frontend ainda será implementado com React, Vite e TypeScript.

## Stack utilizada

### Backend

- Laravel
- Laravel Sanctum
- Eloquent ORM
- SQLite no desenvolvimento local inicial

### Frontend

- React
- Vite
- TypeScript

### Infraestrutura

- Docker Compose

A configuração final com Docker ainda será ajustada para subir backend, frontend e banco automaticamente.

## Base fictícia

A base de dados é populada automaticamente por seeders.

Quantidade aproximada gerada:

- 20 órgãos
- 60 unidades gestoras
- 10 programas
- 80 ações
- 10 funções
- 10 subfunções
- 6 naturezas de despesa
- 6 fontes de recurso
- 21 fornecedores
- 500 orçamentos
- 300 contratos
- 120 revisões
- 1 usuário analista de teste

A base inclui cenários especiais exigidos pelo desafio:

- Orçamentos em execução
- Orçamentos executados
- Orçamentos sem execução
- Orçamentos com saldo negativo
- Orçamentos inconsistentes
- Orçamentos com campos nulos
- Contratos vigentes
- Contratos vencidos
- Contratos encerrados
- Contratos suspensos
- Orçamentos revisados
- Orçamentos não revisados
- Órgão inativo
- Órgão sem orçamento

## Usuário de teste

E-mail:

```bash
analista@seplag.rj.gov.br
```

Senha:

```bash
orcamento@2026
```

## Autenticação

A autenticação foi implementada com Laravel Sanctum utilizando Bearer Token.

O desafio permite Laravel Sanctum ou JWT Auth. A escolha pelo Sanctum foi feita pela integração nativa com Laravel, simplicidade de implementação, suporte a expiração de tokens e facilidade para proteger rotas da API.

O token possui expiração de 8 horas.

O campo `preferred_username` é retornado na resposta do login e no endpoint `/auth/me`, utilizando o e-mail do usuário autenticado.

Rotas protegidas por autenticação:

- `GET /api/auth/me`
- `POST /api/auth/logout`
- `PATCH /api/orcamentos/{id}/revisao`

## Endpoints principais

A documentação detalhada dos endpoints está em:

```bash
backend/API.md
```

Resumo dos endpoints implementados:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/dashboard`
- `GET /api/orgaos`
- `GET /api/orcamentos`
- `GET /api/orcamentos/{id}`
- `PATCH /api/orcamentos/{id}/revisao`
- `GET /api/contratos`
- `GET /api/graficos`

## Como executar o backend localmente

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
composer install
```

Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell, caso prefira:

```powershell
copy .env.example .env
```

Gere a chave da aplicação:

```bash
php artisan key:generate
```

Execute as migrations e seeders:

```bash
php artisan migrate:fresh --seed
```

Suba o servidor local:

```bash
php artisan serve
```

A API ficará disponível em:

```bash
http://127.0.0.1:8000/api
```

## Como validar as rotas da API

Para listar as rotas da API:

```bash
php artisan route:list --path=api
```

Para visualizar também os middlewares:

```bash
php artisan route:list --path=api -v
```

## Decisões arquiteturais

As decisões técnicas iniciais estão documentadas em:

- `docs/architecture.md`
- `docs/decisions.md`

Principais decisões:

- Banco normalizado para representar corretamente o domínio orçamentário.
- Separação entre dados de referência e dados transacionais.
- Revisões armazenadas em tabela própria para manter histórico.
- Status e valores derivados persistidos para facilitar filtros, listagens e dashboard.
- Controllers separados por contexto da API.
- Autenticação com Sanctum e rotas protegidas por middleware `auth:sanctum`.
- Uso de seeders para gerar uma base fictícia consistente e reproduzível.

## Modelagem principal

O domínio foi modelado com as seguintes entidades principais:

- Órgãos
- Unidades gestoras
- Programas
- Ações
- Funções
- Subfunções
- Naturezas de despesa
- Fontes de recurso
- Fornecedores
- Orçamentos
- Contratos
- Revisões
- Usuários

Relacionamentos principais:

- Um órgão possui várias unidades gestoras.
- Um programa possui várias ações.
- Uma função possui várias subfunções.
- Um orçamento pertence a um órgão, unidade gestora, programa, ação, função, subfunção, natureza de despesa e fonte de recurso.
- Um orçamento pode possuir vários contratos.
- Todo contrato pertence a exatamente um orçamento.
- Um orçamento pode possuir várias revisões.
- Cada revisão pertence a um usuário analista.

## Dados derivados

Os registros orçamentários possuem valores derivados utilizados pela API:

- `dotacao_atualizada = dotacao_inicial + suplementacoes - anulacoes`
- `saldo = dotacao_atualizada - valor_empenhado`
- `percentual_execucao = valor_empenhado / dotacao_atualizada * 100`

Também são gerados status de execução:

- `sem_execucao`
- `em_execucao`
- `executado`
- `saldo_negativo`
- `inconsistente`

## Uso de inteligência artificial

Ferramentas de IA foram utilizadas como apoio durante o desenvolvimento para:

- Planejamento da arquitetura
- Apoio na modelagem do banco
- Geração inicial de seeders
- Apoio na criação de controllers e endpoints
- Depuração de erros durante migrations, seeders e autenticação
- Organização da documentação

Todo o código foi revisado, testado localmente e ajustado durante o desenvolvimento.

## Trade-offs atuais

- SQLite foi utilizado inicialmente para acelerar o desenvolvimento local.
- A configuração final com Docker e banco MySQL ou PostgreSQL ainda será ajustada.
- Os retornos JSON ainda podem ser refinados com API Resources.
- O frontend ainda será implementado.
- Testes automatizados ainda não foram adicionados.

## Melhorias futuras

- Adicionar API Resources para padronizar respostas.
- Adicionar Form Requests para validações mais organizadas.
- Adicionar testes de API.
- Adicionar Docker Compose completo com backend, frontend e banco.
- Adicionar frontend React com dashboard, filtros e gráficos.
- Adicionar React Query no frontend.
- Adicionar tratamento visual para dados nulos e inconsistentes.
- Adicionar exportação PDF/Excel.
- Adicionar deploy.