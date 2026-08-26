# Contract: GraphQL `incrementVisitCount` mutation

Первая реальная `Mutation` в GraphQL-схеме проекта (до этой фичи схема содержала только `Query`: `ping` из
`001-personal-landing-page`, `projects` из `002-projects-db-images`). Заменяет статус "мутаций не
существует" из `contracts/graphql-stub.md` (`001-personal-landing-page`).

## Schema (SDL, генерируется автоматически из code-first декораторов `@nestjs/graphql`)

```graphql
type VisitCounter {
  id: ID!
  count: Int!
}

type Mutation {
  incrementVisitCount: VisitCounter!
}
```

## Operation: `incrementVisitCount`

```graphql
mutation IncrementVisitCount {
  incrementVisitCount {
    id
    count
  }
}
```

Мутация не принимает аргументов — не существует способа передать конкретное значение или идентификатор
снаружи; всегда работает с единственной строкой `id: "main"` и увеличивает её `count` на 1.

### Response — пример

```json
{
  "data": {
    "incrementVisitCount": {
      "id": "main",
      "count": 129
    }
  }
}
```

### Response — пример ошибки (backend/БД недоступны)

```json
{
  "errors": [
    {
      "message": "..."
    }
  ],
  "data": null
}
```

Frontend обрабатывает этот случай через `isError` из `useMutation` — см. `VisitCounterSection.tsx`
(`{data && !isError && <Typography>{data.count}</Typography>}`).

## Constraints

- Операция ДОЛЖНА быть `Mutation`, не `Query` — изменяет состояние сервера (см. `research.md`, п.6).
- Операция ДОЛЖНА быть атомарной относительно параллельных вызовов — реализуется через
  `prisma.visitCounter.upsert` с `update.count.increment` (не через отдельное чтение и запись).
- Резолвер (`VisitCounterResolver`) не содержит логики — только делегирует
  `VisitCounterService.incrementAndGet()` (принцип V).
- Мутация вызывается фронтендом не более одного раза за одно монтирование `VisitCounterSection`
  (guard через `useRef` на стороне клиента — сама мутация на backend не дедуплицирует вызовы, это
  сознательное упрощение, см. Assumptions в `spec.md`).

## Consumers

- Frontend: `entities/visit-counter/api/incrementVisitCounter.ts` (`graphql-request`) +
  `useIncrementVisitCounter.ts` (TanStack Query `useMutation`), вызывается виджетом
  `widgets/visit-counter/ui/VisitCounterSection.tsx` при монтировании.
- Ручная проверка через GraphQL playground/`curl` при разработке (см. `quickstart.md`).
