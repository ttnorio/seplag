# SEPLAG - Sistema de Acompanhamento da Execução Orçamentária

Projeto desenvolvido por **Davi Tenório** para o desafio técnico de Desenvolvedor Full Stack Pleno.

Este sistema simula uma aplicação de acompanhamento da execução orçamentária pública, permitindo consultar indicadores consolidados, órgãos, orçamentos, contratos vinculados, gráficos gerenciais e revisões feitas por um analista autenticado.

A aplicação foi construída em formato de monorepo, com backend em Laravel, frontend em React + TypeScript e banco de dados MySQL executando via Docker.

---

## Sumário

- [Visão geral](#visão-geral)
- [Stack utilizada](#stack-utilizada)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Credenciais de acesso](#credenciais-de-acesso)
- [Como executar com Docker](#como-executar-com-docker)
- [Como executar localmente sem Docker](#como-executar-localmente-sem-docker)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Endpoints principais](#endpoints-principais)
- [Banco de dados e massa fictícia](#banco-de-dados-e-massa-fictícia)
- [Decisões arquiteturais](#decisões-arquiteturais)
- [Justificativa das bibliotecas utilizadas](#justificativa-das-bibliotecas-utilizadas)
- [Principais trade-offs](#principais-trade-offs)
- [Uso de IA](#uso-de-ia)
- [Melhorias futuras](#melhorias-futuras)
- [Status do projeto](#status-do-projeto)

---

## Visão geral

O objetivo do projeto é representar um sistema interno para acompanhamento da execução orçamentária de órgãos públicos estaduais.

A aplicação permite que um analista visualize indicadores gerais, consulte orçamentos com filtros e paginação, acesse o detalhe de cada orçamento, veja contratos vinculados e registre revisões nos registros orçamentários.

O projeto foi pensado para demonstrar uma aplicação full stack funcional, organizada e executável tanto localmente quanto por Docker.

---

## Stack utilizada

### Backend

- PHP
- Laravel
- Laravel Sanctum
- Eloquent ORM
- MySQL
- Migrations
- Seeders
- Factories
- API REST

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- Recharts
- Bootstrap 5
- CSS customizado

### Infraestrutura

- Docker
- Docker Compose
- MySQL 8.4
- Nginx para servir o frontend buildado

---

## Funcionalidades implementadas

### Backend

- Autenticação via token com Laravel Sanctum.
- Endpoint de login.
- Endpoint para retorno do usuário autenticado.
- Endpoint de logout.
- Dashboard com indicadores consolidados.
- Listagem de órgãos.
- Listagem de orçamentos com filtros e paginação.
- Detalhamento de orçamento.
- Revisão de orçamento por analista autenticado.
- Listagem de contratos.
- Endpoint de dados para gráficos.
- Seeders para geração de massa fictícia.
- Relacionamentos entre órgãos, unidades gestoras, programas, ações, funções, subfunções, naturezas de despesa, fontes de recurso, orçamentos, contratos, fornecedores e revisões.

### Frontend

- Tela de login.
- Rotas protegidas por token.
- Dashboard com cards de indicadores.
- Gráficos gerenciais.
- Top 10 contratos por valor.
- Tela de orçamentos.
- Filtros de orçamentos.
- Paginação de orçamentos.
- Tela de detalhe do orçamento.
- Exibição de contratos vinculados ao orçamento.
- Exibição de revisões do orçamento.
- Ação de marcar orçamento como revisado.
- Tela de contratos.
- Filtros e paginação de contratos.
- Navegação entre dashboard, orçamentos, contratos e detalhe.

---

## Credenciais de acesso

Usuário padrão criado pelos seeders:

- **E-mail:** `analista@seplag.rj.gov.br`
- **Senha:** `orcamento@2026`

---

## Como executar com Docker

A forma recomendada de executar o projeto é utilizando Docker.

### Pré-requisitos

- Docker
- Docker Compose
- Git

### Subir os containers

Na raiz do projeto:

```bash
docker compose up -d --build
```

Esse comando sobe os seguintes serviços:

- `seplag_mysql`: banco MySQL.
- `seplag_backend`: API Laravel.
- `seplag_frontend`: frontend React servido via Nginx.

### Executar migrations e seeders

Após os containers subirem, execute:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

Esse comando recria o banco de dados e popula a base fictícia utilizada pela aplicação.

### Acessar a aplicação

- **Frontend:** http://localhost:5173
- **Backend/API:** http://localhost:8000/api
- **MySQL:** `localhost:3307`

Dados do banco MySQL:

- **Database:** `seplag`
- **Usuário:** `seplag`
- **Senha:** `seplag`

### Parar os containers

```bash
docker compose down
```

---

## Como executar localmente sem Docker

Também é possível executar backend e frontend localmente.

Nesse caso, é necessário ter PHP, Composer, Node.js e npm instalados.

### Backend

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
Copy-Item .env.example .env
```

Gere a chave da aplicação:

```bash
php artisan key:generate
```

Configure o banco no `.env`.

Se quiser usar o MySQL do Docker, utilize:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=seplag
DB_USERNAME=seplag
DB_PASSWORD=seplag
```

Execute migrations e seeders:

```bash
php artisan migrate:fresh --seed
```

Suba o servidor Laravel:

```bash
php artisan serve
```

A API ficará disponível em:

- http://127.0.0.1:8000/api

### Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

- http://localhost:5173

---

## Estrutura do projeto

```
seplag/
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── API.md
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   └── decisions.md
│
├── docker-compose.yml
└── README.md
```

### Principais pastas

- `backend`: API Laravel.
- `frontend`: interface React + TypeScript.
- `docs`: documentação arquitetural e decisões técnicas.
- `docker-compose.yml`: orquestração dos serviços Docker.
- `backend/API.md`: documentação dos endpoints da API.

---

## Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Realiza login |
| POST | `/api/auth/logout` | Realiza logout |
| GET | `/api/auth/me` | Retorna usuário autenticado |
| GET | `/api/dashboard` | Retorna indicadores consolidados |
| GET | `/api/orgaos` | Lista órgãos |
| GET | `/api/orcamentos` | Lista orçamentos com filtros e paginação |
| GET | `/api/orcamentos/{id}` | Detalha um orçamento |
| PATCH | `/api/orcamentos/{id}/revisao` | Marca orçamento como revisado |
| GET | `/api/contratos` | Lista contratos |
| GET | `/api/graficos` | Retorna dados para gráficos |

Mais detalhes estão documentados em `backend/API.md`.

---

## Banco de dados e massa fictícia

A base fictícia foi criada para simular um cenário público de execução orçamentária.

A massa de dados contempla:

- 20 órgãos.
- Unidades gestoras vinculadas aos órgãos.
- Programas.
- Ações.
- Funções.
- Subfunções.
- Naturezas de despesa.
- Fontes de recurso.
- Fornecedores.
- 500 orçamentos.
- 300 contratos.
- Revisões iniciais.
- Usuário analista para autenticação.

### Status de orçamento

Os orçamentos podem assumir os seguintes status:

- `sem_execucao`
- `em_execucao`
- `executado`
- `saldo_negativo`
- `inconsistente`

### Status de contrato

Os contratos podem assumir os seguintes status:

- `vigente`
- `encerrado`
- `suspenso`
- `vencido`

Alguns dados foram gerados com situações inconsistentes, saldos negativos ou informações ausentes de forma proposital, para simular problemas comuns em bases públicas reais.

---

## Decisões arquiteturais

### Monorepo

Optei por organizar o projeto em monorepo, separando backend e frontend nas pastas `backend` e `frontend`.

Essa estrutura facilita a avaliação do projeto, mantém as responsabilidades separadas e permite subir toda a aplicação com um único `docker-compose.yml`.

### Backend como API REST

O Laravel foi utilizado como API REST. O frontend consome os dados por HTTP utilizando Axios.

Essa separação deixa a aplicação mais próxima de uma arquitetura moderna, onde backend e frontend evoluem de forma independente.

### Banco normalizado

Modelei o banco separando entidades como órgãos, unidades gestoras, programas, ações, funções, subfunções, naturezas de despesa, fontes de recurso, fornecedores, orçamentos, contratos e revisões.

Essa decisão evita duplicação excessiva de dados e deixa o modelo mais próximo de um domínio público real.

### Revisões em tabela própria

As revisões foram modeladas em uma tabela própria, em vez de apenas campos simples no orçamento.

Essa escolha permite histórico, auditoria e expansão futura, como múltiplos analistas, observações, datas e trilhas de revisão.

### Valores derivados persistidos

Campos como `dotacao_atualizada`, `saldo`, `percentual_execucao` e `status` foram persistidos na tabela de orçamentos.

Essa decisão facilita consultas, filtros e dashboards. Em uma evolução futura, a regra de cálculo poderia ser centralizada em um service mais robusto e recalculada quando necessário.

### Docker

Utilizei Docker para padronizar o ambiente da aplicação.

O projeto possui containers separados para MySQL, backend e frontend, conectados por uma rede interna. Isso reduz diferenças entre ambientes e facilita a execução por quem for avaliar o projeto.

---

## Justificativa das bibliotecas utilizadas

### Laravel

Utilizado pela produtividade na criação de APIs, suporte a migrations, seeders, Eloquent ORM, autenticação e organização do backend.

### Laravel Sanctum

Utilizado para autenticação via token. É uma solução integrada ao ecossistema Laravel e suficiente para o escopo da aplicação.

### Eloquent ORM

Utilizado para modelar os relacionamentos do domínio de forma clara e produtiva.

### React

Utilizado para construção da interface de usuário em componentes.

### TypeScript

Utilizado para aumentar a segurança do frontend, tipar respostas da API e reduzir erros durante o desenvolvimento.

### Vite

Utilizado pela velocidade no desenvolvimento e simplicidade na configuração do frontend.

### Axios

Utilizado para centralizar e simplificar as chamadas HTTP para a API.

### React Router DOM

Utilizado para controlar as rotas do frontend, incluindo rotas protegidas.

### Recharts

Utilizado para criação dos gráficos do dashboard de forma simples e integrada ao React.

### Bootstrap 5 e CSS customizado

Bootstrap foi utilizado como apoio visual, enquanto o CSS customizado foi usado para criar a identidade visual das telas, cards, tabelas, botões e gráficos.

### Docker e Docker Compose

Utilizados para padronizar o ambiente e facilitar a execução da aplicação completa.

### Nginx

Utilizado para servir o frontend React já buildado dentro do container Docker.

---

## Principais trade-offs

Durante o desenvolvimento, priorizei uma entrega funcional, clara e defensável dentro do prazo do desafio.

Alguns trade-offs assumidos:

### Repository Pattern

Não criei uma camada Repository para todo o projeto.

Optei por utilizar Controllers, validações, Eloquent e relacionamentos de forma direta, evitando overengineering para o escopo atual. Em um projeto maior, com regras mais complexas ou múltiplas fontes de dados, uma camada Repository ou Query Objects poderia ser considerada.

### Regras de cálculo

Alguns valores derivados foram persistidos diretamente no banco para facilitar dashboard, filtros e performance.

Em uma evolução futura, esses cálculos poderiam ser centralizados em services específicos, com testes automatizados garantindo consistência.

### Frontend com CSS misto

O frontend utiliza Bootstrap, CSS customizado e alguns estilos locais em componentes.

Essa escolha permitiu evoluir rapidamente o visual sem travar o desenvolvimento. Como melhoria futura, eu consolidaria ainda mais os estilos em componentes reutilizáveis e arquivos CSS organizados.

### Autenticação

A autenticação utiliza token com Sanctum e armazenamento no `localStorage`.

Para o escopo do desafio é suficiente. Em um ambiente de produção, seria importante avaliar estratégias adicionais de segurança, expiração, refresh token e proteção contra XSS.

### Testes automatizados

O foco principal foi entregar a aplicação funcional, integrada e documentada.

Testes automatizados são uma melhoria importante e foram listados como evolução futura.

---

## Uso de IA

Durante o desenvolvimento, eu, **Davi Tenório**, utilizei ferramentas de IA como apoio para:

- organização de ideias;
- revisão de arquitetura;
- apoio na depuração de erros;
- geração assistida de trechos de código;
- revisão de documentação;
- sugestões de estrutura para o README.

As decisões finais, adaptações, testes, validações e execução do projeto foram realizados manualmente durante o desenvolvimento.

---

## Melhorias futuras

Com mais tempo, eu implementaria:

- Testes automatizados no backend.
- Testes de integração para endpoints principais.
- Testes no frontend.
- Exportação de dados em Excel e PDF.
- Filtros avançados por órgão, programa, ação, função e fonte de recurso.
- Perfis de usuário e permissões.
- Cache para indicadores do dashboard.
- Auditoria mais detalhada das revisões.
- Logs estruturados.
- Dark mode.
- Melhorias de responsividade.
- Deploy em ambiente cloud.
- Pipeline de CI/CD.
- WebSockets para atualização em tempo real de indicadores.
- Componentização visual mais profunda no frontend.

---

## Status do projeto

O projeto está funcional e cobre os principais fluxos solicitados no desafio:

- Autenticação.
- Dashboard.
- Gráficos.
- Orçamentos.
- Contratos.
- Detalhe de orçamento.
- Revisão de orçamento.
- Banco populado por seeders.
- Execução com Docker.
- Documentação técnica.

Desenvolvido por **Davi Tenório**.