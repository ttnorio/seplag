# Decisões Arquiteturais

Este documento registra as principais decisões técnicas tomadas durante o desenvolvimento do sistema de acompanhamento da execução orçamentária.

A ideia deste arquivo é explicar não apenas o que foi implementado, mas também o motivo das escolhas feitas, os benefícios esperados e os trade-offs assumidos.

Projeto desenvolvido por **Davi Tenório**.

---

## ADR-001 — Organização em monorepo

### Decisão

Organizar o projeto em um único repositório, separando backend, frontend e documentação nas pastas `backend`, `frontend` e `docs`.

### Motivo

O desafio envolve uma aplicação full stack, então manter tudo no mesmo repositório facilita a avaliação, execução e navegação pelo projeto.

Essa estrutura também permite que o ambiente completo seja iniciado a partir da raiz usando `docker-compose.yml`.

### Consequências

Benefícios:

- execução mais simples;
- versionamento centralizado;
- documentação próxima do código;
- backend e frontend organizados de forma separada, mas no mesmo contexto.

Trade-off:

- em projetos maiores, com times separados, poderia fazer sentido separar frontend e backend em repositórios diferentes.

---

## ADR-002 — Backend em Laravel como API REST

### Decisão

Utilizar Laravel como backend da aplicação, expondo os dados por meio de uma API REST.

### Motivo

Laravel oferece boa produtividade para criação de APIs, migrations, seeders, models, controllers, autenticação e relacionamento com banco de dados.

Como o frontend foi desenvolvido separadamente em React, a API REST permite uma divisão clara entre interface e regras de backend.

### Consequências

Benefícios:

- separação clara entre backend e frontend;
- facilidade para testar endpoints isoladamente;
- possibilidade de evolução futura para outros clientes, como mobile ou integrações externas;
- uso produtivo do Eloquent ORM para representar o domínio.

Trade-off:

- algumas regras ficam concentradas nos controllers neste escopo inicial. Em um projeto maior, seria interessante evoluir parte da lógica para services, actions ou query objects.

---

## ADR-003 — Banco de dados MySQL

### Decisão

Utilizar MySQL como banco de dados relacional da aplicação.

### Motivo

O domínio orçamentário possui muitas entidades relacionadas, como órgãos, unidades gestoras, programas, ações, funções, subfunções, orçamentos, contratos e revisões.

Um banco relacional atende bem esse cenário, permitindo integridade, relacionamentos, filtros e consultas agregadas.

Também existe boa integração entre Laravel, Eloquent e MySQL.

### Consequências

Benefícios:

- bom suporte a relacionamentos;
- compatibilidade com Eloquent ORM;
- facilidade de execução via Docker;
- aderência ao tipo de dado usado no desafio.

Trade-off:

- consultas muito agregadas podem exigir otimização, índices ou cache em uma evolução futura.

---

## ADR-004 — Modelagem normalizada

### Decisão

Modelar o banco de forma normalizada, separando entidades como órgãos, unidades gestoras, programas, ações, funções, subfunções, naturezas de despesa, fontes de recurso, fornecedores, contratos, orçamentos e revisões.

### Motivo

Uma base orçamentária pública tende a possuir muitas classificações e relacionamentos. Separar essas entidades evita duplicidade excessiva e deixa o modelo mais próximo de um cenário real.

### Consequências

Benefícios:

- maior organização estrutural;
- menor duplicação de dados;
- melhor representação do domínio;
- maior facilidade para expandir filtros e relatórios no futuro.

Trade-off:

- mais tabelas e relacionamentos;
- consultas podem exigir mais joins;
- exige mais atenção aos nomes dos models e tabelas, principalmente por conta da pluralização em português.

---

## ADR-005 — Revisões em tabela própria

### Decisão

Criar a tabela `revisoes` em vez de armazenar apenas campos simples como `revisado_por` e `data_revisao` diretamente em `orcamentos`.

### Motivo

A revisão é uma ação do usuário sobre um orçamento. Modelar isso em tabela própria permite manter histórico, auditoria e rastreabilidade.

Também permite evoluir o sistema futuramente para múltiplas revisões, observações, status de aprovação e relatórios de auditoria.

### Consequências

Benefícios:

- melhor rastreabilidade;
- possibilidade de histórico;
- vínculo claro entre usuário e orçamento;
- estrutura mais preparada para auditoria.

Trade-off:

- aumenta a quantidade de tabelas e relacionamentos;
- exige uma consulta adicional para carregar revisões no detalhe do orçamento.

---

## ADR-006 — Autenticação com Laravel Sanctum

### Decisão

Utilizar Laravel Sanctum para autenticação via Bearer Token.

### Motivo

O desafio permitia o uso de Sanctum ou JWT Auth. Optei por Sanctum pela integração nativa com Laravel, simplicidade de configuração e boa adequação para APIs com autenticação por token.

### Consequências

Benefícios:

- integração simples com Laravel;
- suporte a tokens pessoais;
- menor complexidade para o escopo do desafio;
- boa compatibilidade com frontend separado.

Trade-off:

- em cenários mais complexos, poderia ser necessário implementar estratégia de refresh token, rotação de tokens, permissões mais granulares e políticas adicionais de segurança.

---

## ADR-007 — Frontend em React com TypeScript

### Decisão

Utilizar React com TypeScript no frontend.

### Motivo

React permite construir a interface em componentes reutilizáveis, enquanto TypeScript melhora a segurança do código e ajuda a evitar erros ao lidar com respostas da API.

Como o projeto possui telas de dashboard, listagem, detalhe, filtros e gráficos, React se encaixa bem pela flexibilidade e ecossistema.

### Consequências

Benefícios:

- interface componentizada;
- melhor organização das telas;
- tipagem das respostas da API;
- menor chance de erros em tempo de desenvolvimento;
- facilidade de evolução visual.

Trade-off:

- exige mais estrutura inicial do que uma interface simples renderizada pelo backend.

---

## ADR-008 — Vite como ferramenta de build

### Decisão

Utilizar Vite para criação e execução do frontend.

### Motivo

Vite oferece ambiente de desenvolvimento rápido, configuração simples e boa integração com React e TypeScript.

### Consequências

Benefícios:

- inicialização rápida;
- build simples;
- boa experiência de desenvolvimento;
- configuração enxuta.

Trade-off:

- exige configuração separada para servir o build em ambiente Docker, resolvida com Nginx.

---

## ADR-009 — Axios para comunicação HTTP

### Decisão

Utilizar Axios para centralizar as chamadas HTTP entre frontend e backend.

### Motivo

Axios facilita a criação de uma instância configurada com `baseURL`, headers e token de autenticação.

Isso deixa as chamadas para a API mais organizadas e evita repetição de configuração nas páginas.

### Consequências

Benefícios:

- comunicação HTTP centralizada;
- facilidade para incluir Bearer Token;
- código mais limpo nas páginas;
- melhor manutenção futura.

Trade-off:

- seria possível usar `fetch`, mas Axios reduz código repetitivo e simplifica interceptações futuras.

---

## ADR-010 — React Query para controle de requisições

### Decisão

Utilizar React Query para gerenciar chamadas, carregamento, erro e cache de dados no frontend.

### Motivo

A aplicação possui várias telas que dependem de dados remotos, como dashboard, gráficos, orçamentos e contratos.

React Query simplifica o gerenciamento desses estados e evita lógica manual repetida com `useEffect`.

### Consequências

Benefícios:

- controle melhor de loading e erro;
- cache de dados;
- menor repetição de código;
- facilidade para refetch após ações, como revisão de orçamento.

Trade-off:

- adiciona uma dependência extra e exige entender seu fluxo de queries.

---

## ADR-011 — Recharts para gráficos

### Decisão

Utilizar Recharts para os gráficos do dashboard.

### Motivo

Recharts possui boa integração com React e permite criar gráficos de barras, pizza e listas visuais de forma simples.

Para o escopo do dashboard, a biblioteca entrega os recursos necessários sem exigir configuração complexa.

### Consequências

Benefícios:

- integração direta com componentes React;
- gráficos simples de implementar;
- boa legibilidade visual;
- facilidade de evolução do dashboard.

Trade-off:

- para gráficos muito complexos ou altamente customizados, outras bibliotecas poderiam oferecer mais controle.

---

## ADR-012 — Bootstrap e CSS customizado

### Decisão

Utilizar Bootstrap como apoio visual e CSS customizado para identidade própria da interface.

### Motivo

Bootstrap acelera a criação de layouts e elementos básicos, enquanto o CSS customizado permite deixar o sistema com aparência mais própria e menos genérica.

### Consequências

Benefícios:

- desenvolvimento visual mais rápido;
- consistência básica de layout;
- possibilidade de personalizar cards, tabelas, botões e gráficos;
- interface mais apresentável para avaliação.

Trade-off:

- parte do frontend ainda possui estilos locais em componentes. Em uma evolução futura, eu consolidaria melhor os estilos em componentes reutilizáveis e arquivos CSS mais segmentados.

---

## ADR-013 — Docker Compose para ambiente completo

### Decisão

Utilizar Docker Compose para orquestrar MySQL, backend Laravel e frontend React/Nginx.

### Motivo

O Docker reduz problemas de ambiente e facilita a execução do projeto por quem for avaliar.

Com um único comando, é possível subir banco, API e frontend.

### Consequências

Benefícios:

- ambiente mais reproduzível;
- execução simplificada;
- separação clara dos serviços;
- menor dependência de configurações locais da máquina do avaliador.

Trade-off:

- o backend usa `php artisan serve` no container para simplificar o desafio. Em produção, seria mais adequado usar PHP-FPM com Nginx dedicado.

---

## ADR-014 — Frontend servido por Nginx no Docker

### Decisão

No ambiente Docker, servir o build do frontend React por meio de Nginx.

### Motivo

Durante o desenvolvimento, o frontend pode rodar com Vite. Porém, para o Docker, é mais adequado gerar o build estático e servi-lo com um servidor web leve.

### Consequências

Benefícios:

- ambiente mais próximo de produção;
- container frontend mais simples em runtime;
- melhor separação entre build e execução;
- Nginx serve os arquivos estáticos de forma eficiente.

Trade-off:

- exige um `Dockerfile` multi-stage e um arquivo `nginx.conf`.

---

## ADR-015 — Dados fictícios com inconsistências controladas

### Decisão

Criar seeders para gerar uma massa fictícia de dados, incluindo orçamentos, contratos, revisões e situações inconsistentes.

### Motivo

O desafio precisava de uma aplicação demonstrável. Uma base fictícia permite testar filtros, dashboards, gráficos, contratos e revisões sem depender de dados externos.

As inconsistências simulam problemas comuns em bases públicas reais.

### Consequências

Benefícios:

- aplicação pronta para demonstração;
- dados suficientes para filtros e gráficos;
- simulação de cenários reais;
- facilidade para resetar o banco com `migrate:fresh --seed`.

Trade-off:

- os dados não representam informações públicas reais;
- regras de geração são simplificadas para o contexto do desafio.

---

## ADR-016 — Status e valores derivados persistidos

### Decisão

Persistir campos derivados como `saldo`, `percentual_execucao` e `status` na tabela de orçamentos.

### Motivo

Esses campos são usados frequentemente em filtros, listagens e dashboard.

Persisti-los facilita consultas e reduz a necessidade de recalcular tudo a cada requisição.

### Consequências

Benefícios:

- filtros mais simples;
- dashboard mais direto;
- menor custo de cálculo durante as consultas;
- melhor experiência na listagem.

Trade-off:

- exige cuidado para manter os valores consistentes;
- em uma evolução futura, esses cálculos poderiam ser centralizados em services e cobertos por testes automatizados.

---

## ADR-017 — Escopo sem testes automatizados nesta etapa

### Decisão

Priorizar a entrega funcional, integração completa, documentação e execução via Docker antes da implementação de testes automatizados.

### Motivo

Dentro do tempo disponível, priorizei garantir que os principais fluxos estivessem funcionando de ponta a ponta:

- login;
- dashboard;
- listagem de orçamentos;
- detalhe de orçamento;
- revisão;
- contratos;
- gráficos;
- seeders;
- Docker.

### Consequências

Benefícios:

- foco na entrega funcional;
- validação manual dos fluxos principais;
- documentação mais completa para avaliação.

Trade-off:

- testes automatizados ficaram como melhoria futura;
- em uma evolução real do projeto, testes de backend e frontend seriam uma prioridade.

---

## ADR-018 — Não utilizar Repository Pattern em todo o projeto

### Decisão

Não criar uma camada Repository para todas as entidades neste escopo inicial.

### Motivo

Para o tamanho atual do projeto, utilizar controllers, validações, Eloquent e relacionamentos de forma direta deixou o código mais simples e objetivo.

Criar repositories para todas as consultas poderia aumentar a complexidade sem benefício proporcional neste momento.

### Consequências

Benefícios:

- código mais direto;
- menor complexidade estrutural;
- desenvolvimento mais rápido;
- facilidade de leitura para avaliação.

Trade-off:

- em um sistema maior, com regras mais complexas, múltiplas fontes de dados ou consultas muito reutilizadas, faria sentido introduzir repositories, services ou query objects.

---

## Resumo das principais decisões

As decisões tomadas priorizaram:

- clareza arquitetural;
- separação entre frontend e backend;
- banco relacional normalizado;
- execução simples via Docker;
- documentação técnica completa;
- interface funcional e apresentável;
- escopo realista para o prazo do desafio.

De forma geral, busquei equilibrar qualidade técnica, simplicidade de execução e entrega funcional.