# Implementation Plan: Проекты из постоянного хранилища данных с изображениями

**Branch**: `002-projects-db-images` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-projects-db-images/spec.md`

## Summary

Блок "Проекты" перестаёт быть статичным frontend-конфигом (как было зафиксировано в
`001-personal-landing-page`) и переносится в PostgreSQL: первая реальная модель `Project` в Prisma-схеме,
первый реальный GraphQL-query (`projects`), первый реальный потребитель API на фронтенде через
`entities/project/api` (TanStack Query + `graphql-request`). Карточка проекта получает необязательное поле
`imageUrl`, изображения размещаются во внешнем S3-совместимом файловом хранилище (MinIO — локально для
разработки, добавляется в `docker-compose.yml`; провайдер для продакшена выбирается отдельно). Загрузка
файлов и управление данными проектов на этом этапе выполняются вручную, без backend-API загрузки и без
аутентификации/админки — вне объёма (принцип X). Два существующих проекта переносятся в БД Prisma-сидом.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) во всех пакетах монорепозитория — без изменений

**Primary Dependencies**: (уже есть) React 18+, MUI + Emotion, TanStack React Query, NestJS, `@nestjs/graphql`,
Prisma ORM; (новое) `graphql-request` (frontend, тонкий GraphQL-клиент поверх React Query), `ts-node` (backend,
dev-зависимость для Prisma seed)

**Storage**: PostgreSQL (уже поднят конституцией) — эта фича добавляет первую доменную модель `Project` и
первую реальную Prisma-миграцию; плюс S3-совместимое объектное хранилище для изображений (MinIO локально,
провайдер по выбору в проде — backend хранит только ссылку-строку, не обращается к хранилищу напрямую)

**Testing**: Jest (backend) — unit-тест `ProjectsService` с замоканным `PrismaService`; Vitest + React Testing
Library (frontend) — unit-тесты `ProjectCard` (рендер/отсутствие изображения) и `ProjectsSection` (состояния
загрузки/ошибки/пустого списка) с замоканным `entities/project/api`

**Target Platform**: Веб, локальная разработка через Docker/docker-compose — без изменений

**Project Type**: web-приложение (frontend + backend монорепозиторий) — без изменений

**Performance Goals**: Стандартные ожидания для маркетинговой SPA-страницы; изображение проекта не должно
блокировать отрисовку остального контента карточки (рендер текста не зависит от загрузки картинки)

**Constraints**: Строгий TypeScript; GraphQL — единственный API-контракт (принцип VI), REST по-прежнему
ограничен `GET /health`; Prisma — единственный доступ к БД, изменения схемы обязаны сопровождаться миграцией
(принцип VII); фронтенд обращается к API только через `entities/project/api` (принцип VIII); никакой
аутентификации, ролей или backend-API загрузки файлов на этом этапе (FR-009); стилизация только через
MUI/Emotion, включая новый элемент `CardMedia` (принцип IV)

**Scale/Scope**: Один новый доменный query (`projects`), одна новая Prisma-модель и миграция, один новый
сервис в `docker-compose.yml` (`minio`), перенос двух существующих записей данных; остальные блоки лендинга
(`001-personal-landing-page`) не затрагиваются

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Принцип конституции                                     | Применимость к фиче                                                                                                                                                                                                                                                                                             | Статус            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| I. Монорепо + строгий TypeScript                        | Новый код (Prisma-модель, резолвер, `entities/project/api`, shared-type) — весь в существующих пакетах, `strict: true`                                                                                                                                                                                          | PASS              |
| II. Conventional Commits                                | Применяется на этапе коммитов реализации                                                                                                                                                                                                                                                                        | PASS (процессное) |
| III. FSD на фронтенде                                   | Новый слой `entities/project/api/` (запросы) добавляется строго внутри `entities`; `widgets/projects` по-прежнему импортирует только из `entities/project`, направление импортов не нарушается                                                                                                                  | PASS              |
| IV. Стилизация только MUI/Emotion                       | Изображение в карточке — через MUI `CardMedia`/`sx`, без сырого CSS; состояния загрузки/ошибки в `ProjectsSection` — через MUI-компоненты (`Skeleton`/`Alert` или аналог)                                                                                                                                       | PASS              |
| V. Модульный backend, тонкие резолверы                  | Новый `ProjectsModule` (`ProjectsResolver` + `ProjectsService`); резолвер только делегирует `service.findAllOrdered()`, вся логика (сортировка, маппинг) — в сервисе                                                                                                                                            | PASS              |
| VI. GraphQL — единственный контракт                     | Добавляется ровно один query `projects` через code-first декораторы; REST по-прежнему только `GET /health`                                                                                                                                                                                                      | PASS              |
| VII. Prisma + обязательные миграции                     | Первая доменная модель (`Project`) и первая реальная миграция (`prisma migrate dev`); прямые SQL-запросы в обход Prisma Client не используются                                                                                                                                                                  | PASS              |
| VIII. Фронтенд обращается к API только через query-слой | Новый `entities/project/api/useProjects.ts` (TanStack Query); компоненты `widgets/projects` и `entities/project/ui` не делают сетевых запросов напрямую                                                                                                                                                         | PASS              |
| IX. Docker/docker-compose для локальной среды           | Добавляется сервис `minio` в тот же `docker-compose.yml`, поднимается той же командой `docker compose up`, что не противоречит принципу (набор `frontend`/`backend`/`postgres` расширяется по обоснованной потребности фичи, а не заменяется)                                                                   | PASS              |
| X. Простота, без лишней инфраструктуры                  | Новая инфраструктура — только MinIO (минимальный способ получить S3-совместимый API локально); явно отклонены: AWS SDK в backend, upload-эндпоинт, аутентификация/админка, GraphQL-codegen, интеграционные тесты с реальной БД (см. `research.md`, пп. 5, 6, 8, 10) — каждое как избыточное для текущего объёма | PASS              |

Нарушений нет → раздел Complexity Tracking не заполняется. Изменение статуса `Project` относительно
`001-personal-landing-page` (там — "не таблица БД", здесь — "доменная таблица") задокументировано явно в
`data-model.md` как осознанная, а не случайная эволюция решения.

## Project Structure

### Documentation (this feature)

```text
specs/002-projects-db-images/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── graphql-projects.md   # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
my-page/
├── docker-compose.yml                     # + сервис `minio` (порты 9000/9001, volume minio-data)
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma              # + model Project
│   │   │   ├── migrations/                # + новая миграция (create Project)
│   │   │   └── seed.ts                    # NEW — upsert двух перенесённых проектов
│   │   ├── package.json                   # + ts-node (dev), + prisma.seed конфиг
│   │   └── src/
│   │       ├── prisma/
│   │       │   ├── prisma.module.ts       # NEW — @Global() модуль
│   │       │   └── prisma.service.ts      # NEW — PrismaService extends PrismaClient
│   │       ├── projects/
│   │       │   ├── projects.module.ts     # NEW
│   │       │   ├── projects.resolver.ts   # NEW — Query.projects, делегирует сервису
│   │       │   ├── projects.service.ts    # NEW — findAllOrdered() (ORDER BY sortOrder)
│   │       │   └── models/
│   │       │       └── project.model.ts   # NEW — @ObjectType Project
│   │       ├── graphql/
│   │       │   └── schema.gql             # регенерируется: + type Project, + Query.projects
│   │       ├── app.module.ts              # + PrismaModule, + ProjectsModule
│   │       └── health/                    # без изменений
│   └── frontend/
│       ├── .env.example                   # NEW — VITE_API_URL
│       └── src/
│           ├── entities/project/
│           │   ├── model/
│           │   │   └── config.ts          # ProjectInfo: + imageUrl?, + sortOrder; статичный массив `projects` удаляется
│           │   ├── api/
│           │   │   ├── getProjects.ts     # NEW — graphql-request запрос PROJECTS_QUERY
│           │   │   └── useProjects.ts     # NEW — useQuery(["projects"], getProjects)
│           │   ├── ui/
│           │   │   └── ProjectCard.tsx    # + CardMedia для imageUrl (условно)
│           │   └── index.ts               # экспортирует useProjects вместо статичного массива projects
│           ├── widgets/projects/ui/
│           │   └── ProjectsSection.tsx    # useProjects(); состояния загрузки/ошибки/пустого списка
│           └── shared/
│               ├── api/
│               │   └── graphqlClient.ts   # NEW — GraphQLClient(`${VITE_API_URL}/graphql`)
│               └── assets/
│                   └── chmtch-screen.PNG  # удаляется после ручного переноса в MinIO (см. quickstart.md)
└── packages/
    └── shared-types/src/
        ├── project.ts                     # NEW — ProjectDto (общий тип frontend/backend)
        └── index.ts                       # + export project.ts
```

**Structure Decision**: Расширение существующей структуры `001-personal-landing-page` без новых пакетов
монорепозитория. Ключевое архитектурное дополнение — первый слой `entities/<сущность>/api` на фронтенде и
первый доменный модуль (`ProjectsModule` + `PrismaModule`) на бэкенде, оба — по паттернам, прямо предписанным
конституцией (принципы V, VIII), но применённым здесь впервые за отсутствием более раннего прецедента.

## Complexity Tracking

_Нарушений Constitution Check нет — раздел не заполняется._
