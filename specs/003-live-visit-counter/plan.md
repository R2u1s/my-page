# Implementation Plan: Живой счётчик посещений

**Branch**: `003-live-visit-counter` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-live-visit-counter/spec.md`

> **Примечание о процессе**: план восстановлен задним числом по факту уже реализованного и слитого кода
> (коммит `17dd6f0`). Раздел "Project Structure" описывает фактически созданные файлы, а не план на будущее.

## Summary

Статичная заглушка счётчика посещений (`entities/visit-counter`, поле `count` в конфиге, `FR-010` из
`001-personal-landing-page`) заменяется реальным значением из PostgreSQL. Добавляется вторая доменная
Prisma-модель `VisitCounter` (после `Project` из `002-projects-db-images`), первая реальная GraphQL-мутация
в схеме (`incrementVisitCount`) — до этого схема содержала только query (`ping`, `projects`), мутаций не
было вовсе. Frontend-виджет вызывает мутацию один раз при монтировании (`useEffect` + `useRef`-guard) и
отображает возвращённое сервером значение вместо статичного числа из конфига.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) во всех пакетах монорепозитория — без изменений

**Primary Dependencies**: без новых зависимостей — используются уже установленные `@nestjs/graphql`, Prisma
ORM, `graphql-request`, TanStack React Query (`useMutation` вместо ранее использовавшегося только
`useQuery`)

**Storage**: PostgreSQL (тот же экземпляр, что и для `Project` из `002-projects-db-images`) — новая модель
`VisitCounter` с единственной строкой (`id: "main"`), обновляемой атомарным `upsert` + `increment`

**Testing**: Jest (backend) — unit-тест `VisitCounterService.incrementAndGet()` с замоканным
`PrismaService`, проверяющий точные аргументы `upsert` (`where`/`update`/`create`); Vitest (frontend) —
unit-тест `incrementVisitCounter()` с замоканным `graphqlClient.request`

**Target Platform**: Веб, локальная разработка через Docker/docker-compose — без изменений

**Project Type**: web-приложение (frontend + backend монорепозиторий) — без изменений

**Performance Goals**: Мутация выполняется один раз за загрузку страницы, не в цикле; не является узким
местом производительности

**Constraints**: Строгий TypeScript; GraphQL — единственный API-контракт (принцип VI) — это первая мутация в
схеме проекта; REST по-прежнему ограничен `GET /health`; Prisma — единственный доступ к БД, изменение схемы
сопровождается миграцией (принцип VII, миграция `20260826162113_add_visit_counter`); резолвер
(`VisitCounterResolver`) не содержит логики — делегирует `VisitCounterService` (принцип V); фронтенд
обращается к API только через `entities/visit-counter/api` (принцип VIII)

**Scale/Scope**: Одна новая Prisma-модель и миграция, одна новая GraphQL-мутация, один новый backend-модуль
(`VisitCounterModule`), правки существующего `entities/visit-counter` и `widgets/visit-counter` на
фронтенде; остальные блоки лендинга не затрагиваются

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Принцип конституции                                     | Применимость к фиче                                                                                                                                                         | Статус            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| I. Монорепо + строгий TypeScript                        | Весь новый код — в существующих пакетах (`apps/backend`, `apps/frontend`, `packages/shared-types`), `strict: true`, без исключений                                          | PASS              |
| II. Conventional Commits                                | Фактический коммит `17dd6f0` оформлен как Conventional Commit-совместимое сообщение с телом и co-author trailer                                                             | PASS (процессное) |
| III. FSD на фронтенде                                   | Новый код строго внутри `entities/visit-counter/api/`; `widgets/visit-counter` продолжает импортировать только из `entities/visit-counter`, направление импорта не нарушено | PASS              |
| IV. Стилизация только MUI/Emotion                       | Виджет не получил новых визуальных элементов — используются уже существующие `Stack`/`Typography`; условный рендер `data && !isError` не требует новых стилей               | PASS              |
| V. Модульный backend, тонкие резолверы                  | Новый `VisitCounterModule` (`VisitCounterResolver` + `VisitCounterService`); резолвер — одна строка делегирования, вся логика (upsert/increment) в сервисе                  | PASS              |
| VI. GraphQL — единственный контракт                     | Добавлена ровно одна мутация `incrementVisitCount` через code-first декораторы; REST по-прежнему только `GET /health`; это первая мутация в схеме проекта                   | PASS              |
| VII. Prisma + обязательные миграции                     | Новая модель `VisitCounter` и реальная миграция (`prisma migrate dev`); прямые SQL-запросы в обход Prisma Client не используются                                            | PASS              |
| VIII. Фронтенд обращается к API только через query-слой | Новый `entities/visit-counter/api/incrementVisitCounter.ts` + `useIncrementVisitCounter.ts` (TanStack Query `useMutation`); виджет не делает сетевых запросов напрямую      | PASS              |
| IX. Docker/docker-compose для локальной среды           | Не требует изменений `docker-compose.yml` — использует уже поднятый `postgres`                                                                                              | PASS              |
| X. Простота, без лишней инфраструктуры                  | Никакой новой инфраструктуры (ни кэша, ни отдельной БД для счётчика); дедупликация по посетителю сознательно не реализована — вне объёма (см. Assumptions в `spec.md`)      | PASS              |

Нарушений нет → раздел Complexity Tracking не заполняется.

## Project Structure

### Documentation (this feature)

```text
specs/003-live-visit-counter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── graphql-visit-counter.md   # Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 output
```

### Source Code (repository root) — фактически созданные/изменённые файлы (коммит `17dd6f0`)

```text
my-page/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma                          # + model VisitCounter
│   │   │   └── migrations/20260826162113_add_visit_counter/migration.sql   # NEW
│   │   └── src/
│   │       ├── visit-counter/
│   │       │   ├── visit-counter.module.ts             # NEW
│   │       │   ├── visit-counter.resolver.ts           # NEW — Mutation.incrementVisitCount
│   │       │   ├── visit-counter.service.ts            # NEW — incrementAndGet() (upsert)
│   │       │   ├── visit-counter.service.spec.ts        # NEW
│   │       │   └── models/
│   │       │       └── visit-counter.model.ts          # NEW — @ObjectType VisitCounter
│   │       └── app.module.ts                           # + VisitCounterModule
│   └── frontend/
│       └── src/
│           ├── entities/visit-counter/
│           │   ├── model/config.ts                     # `count` удалён, остался только `label`
│           │   ├── api/
│           │   │   ├── incrementVisitCounter.ts        # NEW — graphql-request мутация
│           │   │   ├── incrementVisitCounter.test.ts    # NEW
│           │   │   └── useIncrementVisitCounter.ts      # NEW — useMutation
│           │   └── index.ts                            # + export useIncrementVisitCounter
│           └── widgets/visit-counter/ui/
│               └── VisitCounterSection.tsx              # mutate() на mount, рендер data.count
└── packages/
    └── shared-types/src/
        ├── visit-counter.ts                            # NEW — VisitCounter { id, count }
        └── index.ts                                    # + export visit-counter.ts
```

**Structure Decision**: Расширение существующей структуры без новых пакетов монорепозитория. Паттерн
`entities/<сущность>/api` (мутация вместо запроса) применён по аналогии с `entities/project/api` из
`002-projects-db-images`, но с `useMutation` вместо `useQuery` — первый случай мутации на фронтенде проекта.

## Complexity Tracking

_Нарушений Constitution Check нет — раздел не заполняется._
