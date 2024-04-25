
## Descrição do Projeto

API de cadastro de usuários, filmes e gêneros desenvolvida em [Nest](https://github.com/nestjs/nest), PostgreSQL e Redis

## Installation

```bash
$ pnpm install
```

## Abrindo o Projeto em Desenvolvimento

Utilizando um dev container dentro do VS Code, abrir o projeto consiste em simplesmente instalar as dependências via pnpm e rodá-lo pelo terminal. Atente-se as variáveis de ambiente.

```bash
# development
$ pnpm i
$ pnpm start:dev
```

## Stack

- NestJS - Framework de desenvolvimento da API
- TypeORM - ORM para utilização do banco de dados POSTGRESQL
- Docker - Criação de containers para deploy no Fly.io
- Swagger - Guia de rotas da API
- Redis - Ferramenta para administração do cache.


## Github - https://github.com/gcmarcello/mks

## Deploy - https://mks-test.fly.dev/api/

## Detalhes do Projeto

- Através do módulo de JWT do próprio NestJS, desenvolvi um pequeno sistema de autênticação e RBAC. Usuários podem se cadastrar, e devem fazer login para obter o access_token a ser utilizado pelas rotas da API. Também, usuários podem editar e remover a si próprios do sistema (com a exceção do administrador, que pode remover/editar a todos). Administradores também têm a permissão de visualizar outros usuários.
- Utilizando Docker, foi muito mais simples de fazer o deploy do projeto, tanto da máquina principal, quanto do servidor de microserviço de Redis. Os dois estão rodando no Fly.io
- Para utilizar o Redis, desenvolvi um pequeno sistema de cache, onde os filmes e gêneros buscados são armazenados na memória para rápido acesso. Atualizações também servem de gatilho para a atualização do cache.
- O Swagger serve de auxílio para os usuários fazerem uso da API sem uma interface própriamente dita. Contém os exemplos de corpo de request e todas as rotas da API.

