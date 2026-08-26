# Contract: GraphQL `projects` query

Первый реальный (не заглушечный) query в GraphQL-схеме проекта. Заменяет статус "пустая/заглушечная схема"
из `001-personal-landing-page` — начиная с этой фичи схема содержит доменный тип `Project` и операцию чтения
списка проектов.

## Schema (SDL, генерируется автоматически из code-first декораторов `@nestjs/graphql`)

```graphql
type Project {
  id: ID!
  title: String!
  description: String!
  url: String
  imageUrl: String
  isPlaceholder: Boolean!
  sortOrder: Int!
}

type Query {
  ping: String!
  projects: [Project!]!
}
```

## Operation: `projects`

```graphql
query Projects {
  projects {
    id
    title
    description
    url
    imageUrl
    isPlaceholder
  }
}
```

### Response — пример (после переноса данных, см. `data-model.md`)

```json
{
  "data": {
    "projects": [
      {
        "id": "himnavigator",
        "title": "Навигатор Химии",
        "description": "Портал, объединяющий химическую промышленность России...",
        "url": "https://chmtch.ru/",
        "imageUrl": "http://localhost:9000/project-images/chmtch-screen.png",
        "isPlaceholder": false
      },
      {
        "id": "placeholder",
        "title": "Список будет дополняться",
        "description": "",
        "url": null,
        "imageUrl": null,
        "isPlaceholder": true
      }
    ]
  }
}
```

## Constraints

- Список ДОЛЖЕН возвращаться уже отсортированным по `sortOrder` (по возрастанию) — сортировка выполняется на
  backend (`ProjectsService`), frontend не обязан сортировать результат самостоятельно.
- Query не принимает аргументов (фильтрации/пагинации на этом этапе нет — список короткий и полностью
  публичный, см. Assumptions в `spec.md`).
- Никаких `Mutation` для `Project` на этом этапе не существует — создание/изменение/удаление проектов
  выполняется напрямую в БД администратором/разработчиком (FR-009), не через API.
- Резолвер (`ProjectsResolver`) не содержит логики — только делегирует `ProjectsService.findAllOrdered()`
  (принцип V).

## Consumers

- Frontend: `entities/project/api/useProjects.ts` (TanStack Query hook), используемый виджетом
  `widgets/projects/ui/ProjectsSection.tsx`.
- Ручная проверка через GraphQL playground/`curl` при разработке (см. `quickstart.md`).
