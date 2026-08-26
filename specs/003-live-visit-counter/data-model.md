# Phase 1 Data Model: Живой счётчик посещений

> Восстановлено задним числом по фактической реализации (коммит `17dd6f0`).

## VisitCounter (`apps/backend/prisma/schema.prisma`, GraphQL `ObjectType`, `entities/visit-counter`)

Единственная сущность фичи — заменяет frontend-заглушку (`entities/visit-counter` в
`001-personal-landing-page`, поле `count` статичного конфига) реальной записью в PostgreSQL.

### Prisma-модель

```prisma
model VisitCounter {
  id        String   @id @default("main")
  count     Int      @default(0)
  updatedAt DateTime @updatedAt
}
```

| Поле        | Тип        | Обязательность | Описание                                                                                         |
| ----------- | ---------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `id`        | `String`   | обязательное   | Первичный ключ; на практике всегда равен `"main"` (см. `research.md`, п.3) — единственная строка |
| `count`     | `Int`      | обязательное   | Текущее агрегированное количество посещений; по умолчанию `0`, увеличивается атомарно на 1       |
| `updatedAt` | `DateTime` | обязательное   | Автоматически обновляется Prisma (`@updatedAt`) при каждом изменении строки                      |

**Migration**: `20260826162113_add_visit_counter` — `CREATE TABLE "VisitCounter" (id TEXT NOT NULL DEFAULT
'main', count INTEGER NOT NULL DEFAULT 0, updatedAt TIMESTAMP(3) NOT NULL, CONSTRAINT "VisitCounter_pkey"
PRIMARY KEY (id))`.

**Validation rules**: `count` — целое неотрицательное число, изменяется исключительно через атомарный
`upsert`/`increment` (`VisitCounterService.incrementAndGet()`), без прямого присвоения произвольного
значения через API (мутация не принимает аргументов — нет способа "установить" число снаружи, только
увеличить на 1).

**State/Lifecycle**: строка с `id: "main"` создаётся автоматически при первом вызове мутации
(`create: { id: "main", count: 1 }` внутри `upsert`), далее только обновляется (`increment`). Строка никогда
не удаляется в рамках нормальной работы приложения.

### GraphQL `ObjectType` (`apps/backend/src/visit-counter/models/visit-counter.model.ts`)

```ts
@ObjectType()
export class VisitCounter {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  count!: number;
}
```

Поле `updatedAt` из Prisma-модели сознательно НЕ выставлено в GraphQL-тип — фронтенду оно не нужно (нет
сценария, отображающего время последнего посещения).

### Общий DTO-тип (`packages/shared-types/src/visit-counter.ts`)

```ts
export interface VisitCounter {
  id: string;
  count: number;
}
```

Используется и backend-резолвером (через структурное соответствие GraphQL-модели), и фронтендом
(`entities/visit-counter/api/incrementVisitCounter.ts` типизирует ответ мутации этим интерфейсом) —
единый источник истины для формы данных между двумя приложениями монорепозитория (аналогично `Project` из
`002-projects-db-images`).

### Frontend-конфиг (`entities/visit-counter/model/config.ts`)

```ts
export interface VisitCounterInfo {
  label: string;
}

export const visitCounter: VisitCounterInfo = {
  label: "Посещений страницы",
};
```

Хранит только статичную подпись (FR-006) — числовое значение больше не часть статичного конфига, оно
приходит исключительно из ответа мутации `incrementVisitCount` (поле `data.count` результата
`useIncrementVisitCounter()`).

**Relationships**: сущность полностью независима от `Profile`, `Skill`, `Project` — не имеет внешних ключей
и не пересекается с ними ни на уровне БД, ни на уровне GraphQL-схемы.
