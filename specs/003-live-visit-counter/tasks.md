---
description: "Task list template for feature implementation"
---

# Tasks: Живой счётчик посещений

**Input**: Design documents from `/specs/003-live-visit-counter/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Тесты покрыты (backend unit-тест сервиса, frontend unit-тест API-функции) — соответствует
фактически написанному коду.

> **Примечание**: все задачи ниже отмечены как выполненные (`[x]`) — фича была реализована и слита в
> `master` (коммит `17dd6f0`) до того, как для неё был оформлен spec-kit документ-набор. Задачи
> восстановлены по фактическому диффу коммита, а не написаны заранее.

**Organization**: Единственная пользовательская история (US1) — вся фича умещается в одну сквозную цепочку
задач без разделения на фазы по историям.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: US1 (единственная история фичи)
- Указаны точные пути к файлам

## Path Conventions

Монорепозиторий: `apps/frontend/src/...`, `apps/backend/src/...`, `packages/shared-types/...`.

---

## Phase 1: Backend — модель данных и мутация

- [x] T001 Добавить модель `VisitCounter` в `apps/backend/prisma/schema.prisma`
      (`id String @id @default("main")`, `count Int @default(0)`, `updatedAt DateTime @updatedAt`)
- [x] T002 Создать и применить Prisma-миграцию `add_visit_counter`
      (`apps/backend/prisma/migrations/20260826162113_add_visit_counter/migration.sql`)
- [x] T003 [P] Создать GraphQL `ObjectType` в
      `apps/backend/src/visit-counter/models/visit-counter.model.ts` (`id: ID!`, `count: Int!`)
- [x] T004 [US1] Реализовать `VisitCounterService.incrementAndGet()` в
      `apps/backend/src/visit-counter/visit-counter.service.ts` — атомарный `prisma.visitCounter.upsert`
      (`update.count.increment: 1`, `create: { id: "main", count: 1 }`)
- [x] T005 [P] Написать unit-тест сервиса в
      `apps/backend/src/visit-counter/visit-counter.service.spec.ts` (замоканный `PrismaService`, проверка
      точных аргументов `upsert`)
- [x] T006 [US1] Реализовать тонкий резолвер `VisitCounterResolver` в
      `apps/backend/src/visit-counter/visit-counter.resolver.ts` — `@Mutation(() => VisitCounter)
    incrementVisitCount()`, делегирует `VisitCounterService.incrementAndGet()` без собственной логики
      (принцип V)
- [x] T007 Создать `VisitCounterModule` в `apps/backend/src/visit-counter/visit-counter.module.ts`
      (providers: `VisitCounterResolver`, `VisitCounterService`) и подключить в
      `apps/backend/src/app.module.ts`

**Checkpoint**: `curl`-запрос мутации `incrementVisitCount` возвращает и увеличивает значение в БД (см.
`quickstart.md`)

---

## Phase 2: Shared types

- [x] T008 [P] Создать общий DTO-тип `VisitCounter { id: string; count: number }` в
      `packages/shared-types/src/visit-counter.ts` и реэкспортировать в `packages/shared-types/src/index.ts`

---

## Phase 3: Frontend — вызов мутации и отображение

- [x] T009 [P] [US1] Убрать статичное поле `count` из `VisitCounterInfo` и конфига `visitCounter` в
      `apps/frontend/src/entities/visit-counter/model/config.ts` — остаётся только `label`
- [x] T010 [US1] Реализовать `incrementVisitCounter()` в
      `apps/frontend/src/entities/visit-counter/api/incrementVisitCounter.ts` (`graphql-request`, мутация
      `IncrementVisitCount`, типизация ответа через `@my-page/shared-types`)
- [x] T011 [P] Написать unit-тест в
      `apps/frontend/src/entities/visit-counter/api/incrementVisitCounter.test.ts` (замоканный
      `graphqlClient.request`)
- [x] T012 [US1] Реализовать `useIncrementVisitCounter()` в
      `apps/frontend/src/entities/visit-counter/api/useIncrementVisitCounter.ts` (TanStack Query
      `useMutation`)
- [x] T013 Реэкспортировать `useIncrementVisitCounter` в
      `apps/frontend/src/entities/visit-counter/index.ts`
- [x] T014 [US1] Обновить `apps/frontend/src/widgets/visit-counter/ui/VisitCounterSection.tsx`: вызывать
      `mutate()` один раз при монтировании (`useEffect` + `useRef`-guard от повторного вызова), рендерить
      `data.count` вместо статичного значения конфига, скрывать число при `isError` (Edge Case —
      недоступность backend)

**Checkpoint**: блок счётчика на лендинге отображает реальное значение из БД и увеличивается при каждой
загрузке страницы (Independent Test из `spec.md`)

---

## Phase 4: Документация (восстановлена этой сессией)

- [x] T015 Создать полный spec-kit документ-набор фичи задним числом (`spec.md`, `plan.md`, `research.md`,
      `data-model.md`, `contracts/graphql-visit-counter.md`, `quickstart.md`, `tasks.md`,
      `checklists/requirements.md`)
- [x] T016 Обновить `specs/001-personal-landing-page/spec.md` (FR-010, Assumptions),
      `data-model.md` (раздел VisitCounter) и `contracts/graphql-stub.md` — добавить перекрёстные ссылки на
      эту фичу как замену статичной заглушки
- [x] T017 Обновить `.specify/feature.json`, указав текущей фичей `specs/003-live-visit-counter`

---

## Dependencies & Execution Order

- **Phase 1 (Backend)**: T001 → T002 (миграция после модели) → T003/T004 (параллельно) → T005 (после T004)
  → T006 (после T003, T004) → T007 (после T006)
- **Phase 2 (Shared types)**: независима от Phase 1, можно параллельно
- **Phase 3 (Frontend)**: T009 независима; T010 зависит от Phase 2 (использует `VisitCounter` DTO); T011
  после T010; T012 после T010; T013 после T012; T014 после T012 и T009
- **Phase 4 (Документация)**: выполняется после того, как код (Phase 1–3) уже существует — восстановление
  задним числом, а не планирование наперёд

## Notes

- [P] задачи — разные файлы, нет зависимостей друг от друга
- Метка [Story] проставлена только для задач, прямо реализующих US1
- Все задачи выполнены до оформления этого документа — статусы отражают фактическое состояние кода на
  момент написания (2026-08-26), подтверждённое `pnpm lint && pnpm typecheck && pnpm test`
