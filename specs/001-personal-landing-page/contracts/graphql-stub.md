# Contract: GraphQL заглушечная схема

Единственный контракт GraphQL API на этом этапе — no-op placeholder, подтверждающий, что схема генерируется
из кода (`@nestjs/graphql`, code-first) и готова к будущему наполнению реальными query/mutation (FR-014).

## Schema (SDL, генерируется автоматически из code-first декораторов)

```graphql
type Query {
  ping: String!
}
```

## Operation: `ping`

```graphql
query Ping {
  ping
}
```

### Response

```json
{
  "data": {
    "ping": "ok"
  }
}
```

## Constraints

- Никаких `Mutation`, доменных `ObjectType` или реальных операций чтения/записи данных на этом этапе не
  существует — это осознанная граница объёма фичи (FR-014).
- Схема НЕ пишется вручную — генерируется из декораторов `@Resolver`/`@Query` согласно принципу VI конституции.
- Frontend на этом этапе не является потребителем этого контракта (весь контент лендинга — статичные
  конфиги entities, см. `data-model.md`); контракт существует как техническая заготовка для последующих фич
  (например, будущего реального счётчика посещений).

> **⚠ Обновление задним числом**: приведённое выше — контракт на момент этой фичи. Начиная с
> `002-projects-db-images` (query `projects`) и `003-live-visit-counter` (mutation `incrementVisitCount`)
> схема перестала быть чисто заглушечной. Актуальные контракты см. в
> `specs/002-projects-db-images/contracts/graphql-projects.md` и
> `specs/003-live-visit-counter/contracts/graphql-visit-counter.md`. Этот файл сохранён как исторический
> снимок исходного состояния схемы.
