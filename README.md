
# Bank Account

API REST simulando gerenciamento de conta em banco em operações de CRUD.

### Tech Stack

[Nest](https://github.com/nestjs/nest) framework TypeScript.

[Postgres](https://www.postgresql.org/) banco de dados.

[Docker](https://docs.docker.com/desktop/install/mac-install/)

[Prisma](https://prisma.io/)



### Funcionalidades

- Criar Conta
- Depositar valores
- Sacar valores
- Excluir Conta


### Inicialização do banco de dados

Certifique-se de ter o docker e postgres instalados no computador.

Foi utilizado o docker compose para criar o banco de dados. 

```bash
  docker-compose up
```
### Instalação dos pacotes

```bash
  yarn
```

### Executar Migration de criação de tabelas no banco

```bash
  yarn prisma migrate dev
```

### Inicialização da API

```bash
  yarn start
```

### Testes Unitarios

```bash
  yarn test
```

## Testes

O arquivo para importação no insomnia se encontra na raiz do projeto

## Autores

- [@vitorramalho](https://github.com/vitor-ramalho)

