# Estrutura do Banco de Dados

A aplicação utiliza PostgreSQL com migrations gerenciadas pelo TypeORM. A seguir, um resumo das principais tabelas criadas até o momento.

## Tabelas

### user

| Coluna      | Tipo                       | Notas                               |
|-------------|----------------------------|--------------------------------------|
| id          | SERIAL (PK)                | Identificador único                  |
| name        | character varying          | Nome do usuário                      |
| email       | character varying          | Único por usuário                    |
| password    | character varying          | Hash armazenado                      |
| createdAt   | timestamp with time zone   | Valor padrão `now()`                 |
| updatedAt   | timestamp with time zone   | Valor padrão `now()`                 |
| deletedAt   | timestamp                  | Soft delete (opcional)               |

### list

| Coluna      | Tipo                       | Notas                                                 |
|-------------|----------------------------|--------------------------------------------------------|
| id          | SERIAL (PK)                | Identificador único                                    |
| name        | character varying          | Nome da lista                                          |
| description | character varying          | Descrição opcional                                     |
| ownerId     | integer (FK -> user.id)    | Proprietário; remoção em cascata                       |
| users       | many-to-many               | Relacionamento via tabela `list_users`                 |
| createdAt   | timestamp with time zone   | Valor padrão `now()`                                   |
| updatedAt   | timestamp with time zone   | Valor padrão `now()`                                   |
| deletedAt   | timestamp                  | Soft delete (opcional)                                 |

### list_users (tabela de associação)

| Coluna  | Tipo                    | Notas                                          |
|---------|-------------------------|------------------------------------------------|
| listId  | integer (FK -> list.id) | Participante da lista; chave primária composta |
| userId  | integer (FK -> user.id) | Usuário associado; chave primária composta     |

### list_item

| Coluna        | Tipo                       | Notas                                                           |
|---------------|----------------------------|------------------------------------------------------------------|
| id            | SERIAL (PK)                | Identificador único                                              |
| name          | character varying          | Descrição do item                                               |
| quantity      | integer                    | Valor padrão `1`                                                 |
| listId        | integer (FK -> list.id)    | Lista associada; remoção em cascata                              |
| assignedToId  | integer (FK -> user.id)    | Usuário responsável; `SET NULL` ao remover usuário              |
| deletedAt     | timestamp                  | Soft delete (opcional)                                           |
| createdAt     | timestamp with time zone   | Valor padrão `now()`                                             |
| updatedAt     | timestamp with time zone   | Valor padrão `now()`                                             |

## Migrations

| Arquivo                                      | Descrição                                                                 |
|----------------------------------------------|---------------------------------------------------------------------------|
| `1759077432893-ListAndUserTables.ts`         | Cria tabelas `user` e `list` com relacionamento `ownerId`.                |
| `1759077530000-ListItemTable.ts`             | Cria `list_item` com referências para `list` e `user`.                    |
| `1762134779045-UpdateListItemTable.ts`       | Atualiza `list_item`, removendo `assignedAt`, adicionando `deletedAt` e ajustando FKs. |
| `1762821816278-AddListUserJoinTable.ts`      | Cria tabela de junção `list_users` para compartilhar listas entre usuários. |

## Executando migrations

```
npm run migration:run
```

Para criar uma nova migration:

```
npm run migration:generate src/database/migrations/NomeDaMigration -- (sempre coloque um nome diferente para cada migration)
```
Para revertar uma migration:

```
npm run migration:revert
```

Lembre-se de revisar os arquivos gerados antes de rodar em produção.
