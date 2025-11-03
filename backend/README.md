# Backend API

Este backend foi reestruturado para priorizar a API do catálogo utilizando Prisma + SQLite, seguindo uma organização inspirada no projeto de referência indicado.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

Dentro da pasta `backend` execute:

```bash
npm install
```

As dependências utilizam versões atuais das bibliotecas (`express`, `cors`, `multer`, `dotenv`, `@prisma/client`).

## Scripts disponíveis

- `npm run dev` – inicia o servidor com `nodemon`.
- `npm run start` – inicia o servidor em modo produção.
- `npm run prisma:generate` – gera o client do Prisma.
- `npm run prisma:migrate:dev` – cria uma nova migração (ambiente de desenvolvimento).
- `npm run prisma:migrate:deploy` – aplica as migrações pendentes (produção/CI).
- `npm run db:seed` – importa o conteúdo de `assets/catalogo.json` para o banco.
- `npm test` – executa os testes automatizados (`node --test`).

## Estrutura de pastas

```
src/
  app.js             # configuração do Express
  server.js          # bootstrap do servidor
  config/            # variáveis de ambiente e registrador de alias
  controllers/       # classes de controllers (ex.: CatalogController)
  dtos/              # validadores/parsers de payload
  errors/            # filtros de erro HTTP e 404
  lib/               # integrações compartilhadas (Prisma)
  middlewares/       # middlewares de upload e outros
  repositories/      # camada de acesso a dados
  routes/            # roteadores públicos/privados
  services/          # regras de negócio
  utils/             # utilidades puras
```

O arquivo `src/config/register-alias.js` habilita o prefixo `@/` apontando para `src`, mantendo os imports curtos.

## Banco de dados (Prisma + SQLite)

O Prisma está configurado para SQLite. O arquivo padrão é criado em `backend/var/database.sqlite`, podendo ser sobrescrito através da variável `DATABASE_URL`.

1. Gere o client (apenas na primeira vez ou após alterar o schema):
   ```bash
   npm run prisma:generate
   ```
2. Aplique as migrações:
   ```bash
   npm run prisma:migrate:deploy
   ```
3. (Opcional) Popular a base com `assets/catalogo.json`:
   ```bash
   npm run db:seed
   ```

Para criar novas migrações durante o desenvolvimento utilize `npm run prisma:migrate:dev` e siga as instruções do Prisma.

## Endpoints do catálogo

Todas as rotas ficam sob `/api`.

- `GET /api/catalog` – Lista os itens do catálogo.
- `POST /api/catalog` – Cadastra novos itens (requisição `multipart/form-data` com campo `images`).
- `PUT /api/catalog/:image` – Atualiza os metadados de um item existente.
- `DELETE /api/catalog/:image` – Remove um item e exclui a imagem local associada.

### Campos esperados

- `nome` (string, obrigatório)
- `tipo` (string, opcional)
- `material` (string, opcional)
- `ambientes` (array de strings ou string separada por vírgulas)

As imagens são salvas em `assets/images/catalogo` com nomes normalizados (`nome---tipo---material---ambiente---N.ext`).

## Variáveis de ambiente

| Variável             | Descrição                                        | Padrão                             |
| -------------------- | ------------------------------------------------ | ---------------------------------- |
| `PORT`               | Porta exposta pela API                           | `3000`                             |
| `DATABASE_URL`       | URL do banco SQLite usado pelo Prisma            | `file:backend/var/database.sqlite` |
| `CATALOG_UPLOAD_DIR` | Diretório onde as imagens serão armazenadas      | `assets/images/catalogo`           |

Copie o arquivo `.env.example` para `.env` na pasta `backend` e ajuste os valores conforme necessário:

```bash
cp .env.example .env
```

## Testes

A suíte `tests/catalog.repository.test.js` valida as operações do repositório utilizando um banco SQLite temporário e executando `prisma migrate deploy`. Execute:

```bash
npm test
```

## Próximos passos sugeridos

- Adicionar autenticação e autorização conforme a necessidade do painel.
- Documentar a API (por exemplo, com OpenAPI/Swagger).
- Expandir o domínio adicionando novos módulos seguindo o mesmo padrão de controllers em classe.
