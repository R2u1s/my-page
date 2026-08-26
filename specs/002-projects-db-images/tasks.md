---
description: "Task list template for feature implementation"
---

# Tasks: Проекты из постоянного хранилища данных с изображениями

**Input**: Design documents from `/specs/002-projects-db-images/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/graphql-projects.md, quickstart.md

**Tests**: Юнит-тесты, запланированные в `research.md` (п.10), пропущены по решению пользователя в ходе `/speckit-implement` — в репозитории нет тестовой инфраструктуры (ни Jest, ни Vitest; `001-personal-landing-page` тоже её не заводила), заводить её ради нескольких точечных тестов признано избыточным. Задачи T023, T026, T029 закрываются ручной проверкой по `quickstart.md`.

**Organization**: Задачи сгруппированы по user story из `spec.md` для независимой реализации и проверки каждой истории.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Может выполняться параллельно (другой файл, нет зависимости от незавершённых задач)
- **[Story]**: К какой user story относится задача (US1, US2, US3)
- В описании — точный путь к файлу

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Зависимости и инфраструктура, нужные всей фиче

- [x] T001 Добавить зависимость `graphql-request` в apps/frontend/package.json
- [x] T002 [P] Добавить dev-зависимость `ts-node` и конфиг `"prisma": {"seed": "ts-node prisma/seed.ts"}` в apps/backend/package.json
- [x] T003 [P] Добавить сервис `minio` (порты 9000/9001, `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD`, volume `minio-data`) в docker-compose.yml
- [x] T004 [P] Добавить переменную окружения `VITE_API_URL` сервису `frontend` в docker-compose.yml и создать apps/frontend/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Инфраструктура, без которой не может быть реализована ни одна user story

**⚠️ CRITICAL**: Ни одна user story не начинается до завершения этой фазы

- [x] T005 Добавить модель `Project` в apps/backend/prisma/schema.prisma по `data-model.md`
- [x] T006 Выполнить `prisma migrate dev --name add-project`, сгенерировав миграцию в apps/backend/prisma/migrations/ (зависит от T005)
- [x] T007 [P] Создать `PrismaService` в apps/backend/src/prisma/prisma.service.ts
- [x] T008 Создать `PrismaModule` (`@Global()`) в apps/backend/src/prisma/prisma.module.ts (зависит от T007)
- [x] T009 Зарегистрировать `PrismaModule` в apps/backend/src/app.module.ts (зависит от T008)
- [x] T010 [P] Создать GraphQL-тип `Project` (`@ObjectType`) в apps/backend/src/projects/models/project.model.ts
- [x] T011 [P] Реализовать `ProjectsService.findAllOrdered()` (сортировка по `sortOrder`) в apps/backend/src/projects/projects.service.ts (зависит от T007)
- [x] T012 Реализовать `ProjectsResolver` (`Query.projects`, только делегирование сервису) в apps/backend/src/projects/projects.resolver.ts (зависит от T010, T011)
- [x] T013 Создать `ProjectsModule` и зарегистрировать в apps/backend/src/app.module.ts (зависит от T012)
- [x] T014 [P] Создать apps/backend/prisma/seed.ts — `prisma.project.upsert` по `id` для записей `himnavigator` и `placeholder` (включая `imageUrl`) по таблице миграции данных из `data-model.md` (зависит от T006)
- [x] T015 [P] Добавить DTO `Project` в packages/shared-types/src/project.ts и экспортировать из packages/shared-types/src/index.ts
- [x] T016 [P] Создать GraphQL-клиент (`graphql-request`, адрес из `VITE_API_URL`) в apps/frontend/src/shared/api/graphqlClient.ts (зависит от T004)
- [x] T017 Создать функцию запроса `getProjects` в apps/frontend/src/entities/project/api/getProjects.ts (зависит от T015, T016)
- [x] T018 Создать хук `useProjects` (TanStack Query) в apps/frontend/src/entities/project/api/useProjects.ts (зависит от T017)
- [x] T019 Обновить apps/frontend/src/entities/project/model/config.ts: расширить тип `ProjectInfo` полями `imageUrl`/`sortOrder`, удалить захардкоженный массив `projects` (зависит от T015)
- [x] T020 Обновить apps/frontend/src/entities/project/index.ts: экспортировать `useProjects` вместо статичного массива `projects` (зависит от T018, T019)
- [x] T021 Обновить apps/frontend/src/widgets/projects/ui/ProjectsSection.tsx: использовать `useProjects()` с состояниями загрузки/ошибки/пустого списка (MUI), убрать прямой импорт статичного массива (зависит от T020)

**Checkpoint**: Backend отдаёт `projects` из Postgres через GraphQL; блок "Проекты" на лендинге рендерится живыми данными (без изображений) — готово к реализации конкретных user story.

---

## Phase 3: User Story 1 - Посетитель видит проект с иллюстрацией (Priority: P1) 🎯 MVP

**Goal**: Карточка проекта отображает изображение-превью, если оно указано, и корректно выглядит без него

**Independent Test**: открыть блок проектов — у карточки "Навигатор Химии" отображается изображение; у карточки-заглушки изображения нет и вёрстка не ломается

- [x] T022 [US1] Обновить apps/frontend/src/entities/project/ui/ProjectCard.tsx: добавить MUI `CardMedia`, отображаемый только при наличии `imageUrl` (зависит от T021)
- [x] T023 [P] [US1] ~~Юнит-тест рендера изображения (с `imageUrl` и без)~~ — пропущено по решению пользователя (нет тестовой инфраструктуры), см. заметку Tests выше
- [x] T024 [US1] Вручную загрузить apps/frontend/src/shared/assets/chmtch-screen.PNG в бакет MinIO и выставить публичную политику на чтение (см. quickstart.md) — фактически использован бакет `my-page` (не `project-images`), объект `chmtch-screen.PNG`; `seed.ts` и `docker-compose.yml` (T003) обновлены под фактическое имя бакета; проверено: `GET http://localhost:9000/my-page/chmtch-screen.PNG` → 200

**Checkpoint**: User Story 1 полностью функциональна и проверяема независимо

---

## Phase 4: User Story 2 - Обновление списка проектов без изменения кода (Priority: P1)

**Goal**: Изменение данных проекта (или добавление нового) в хранилище становится видимым посетителям без правки кода и пересборки фронтенда

**Independent Test**: изменить данные проекта в БД, не трогая код — после обновления страницы посетитель видит изменения

- [x] T025 [US2] Проверить/скорректировать `ProjectsService.findAllOrdered()` — гарантировать `ORDER BY sortOrder ASC` на уровне запроса Prisma в apps/backend/src/projects/projects.service.ts (FR-006)
- [x] T026 [P] [US2] ~~Юнит-тест сортировки по `sortOrder` с замоканным `PrismaService`~~ — пропущено по решению пользователя (нет тестовой инфраструктуры), см. заметку Tests выше
- [x] T027 [US2] Ручная проверка по `quickstart.md` (раздел User Story 2): изменить данные проекта через Prisma Studio, убедиться, что обновление страницы показывает изменения без пересборки фронтенда (проверено прямым `UPDATE` в Postgres + повторным GraphQL-запросом без перезапуска backend — изменение отражается сразу)

**Checkpoint**: User Stories 1 и 2 работают независимо

---

## Phase 5: User Story 3 - Сохранение текущего содержимого при переносе (Priority: P2)

**Goal**: После переноса данных посетитель видит тот же список и порядок проектов, что и раньше, без потери контента

**Independent Test**: сравнить список и порядок карточек до/после переноса — совпадают, у "Навигатор Химии" дополнительно появляется изображение

- [x] T028 [US3] Сверить значения в apps/backend/prisma/seed.ts (`title`, `description`, `url`, `sortOrder`) с исходным содержимым apps/frontend/src/entities/project/model/config.ts (в истории git) — устранить расхождения, если найдены (репозиторий ещё не закоммичен, сверка выполнена по содержимому исходного файла, прочитанному до его перезаписи — расхождений нет)
- [x] T029 [P] [US3] ~~Юнит/регрессионный тест ссылки `target="_blank"`/`rel="noopener noreferrer"`~~ — пропущено по решению пользователя (нет тестовой инфраструктуры); подтверждено вручную чтением apps/frontend/src/entities/project/ui/ProjectCard.tsx (атрибуты присутствуют)
- [x] T030 [US3] Ручная проверка по `quickstart.md` (раздел User Story 3 / Edge Cases): состав и порядок карточек совпадают с состоянием до переноса, ссылка "Навигатор Химии" работает как раньше (подтверждено GraphQL-ответом: `himnavigator` sortOrder 1 → `placeholder` sortOrder 2, `url: "https://chmtch.ru/"`, ссылка открывается через `target="_blank" rel="noopener noreferrer"`)

**Checkpoint**: Все user story независимо функциональны

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Финальная зачистка и сквозная проверка

- [x] T031 [P] Удалить более не используемый файл apps/frontend/src/shared/assets/chmtch-screen.PNG после подтверждения, что изображение доступно из MinIO (зависит от T024, T028) — удалён, ссылок на него в коде не осталось
- [x] T032 [P] Убедиться, что apps/backend/.env.example и apps/frontend/.env.example документируют все новые переменные окружения (`VITE_API_URL`, при необходимости — переменные MinIO) — apps/frontend/.env.example содержит `VITE_API_URL`; apps/backend/.env.example изменений не требует (backend не обращается к MinIO напрямую, только хранит готовый URL картинки)
- [x] T033 Полный прогон `quickstart.md` от начала до конца (`docker compose up`, миграция, сид, GraphQL-запрос, визуальная проверка, проверка устойчивости к недоступности backend) — финальная валидация фичи. ✅ **Обновление задним числом**: полный стек поднят через `docker compose up -d` (postgres, minio, backend); миграции применены (`prisma migrate deploy`, "No pending migrations to apply" на чистой БД после T005-T021), GraphQL-запрос `projects` подтверждён через `curl` — вернул оба проекта (`himnavigator` с реальным `imageUrl` из MinIO бакета `my-page`, `sortOrder` корректный; `placeholder`). Проверка устойчивости к недоступности backend подтверждена: при `docker compose stop backend` GraphQL/`/health` становятся недоступны без падения postgres/minio, при повторном старте backend восстанавливается healthy, данные не теряются (Postgres-хранилище). В процессе обнаружен и исправлен реальный баг в `apps/backend/Dockerfile` (генерация Prisma-клиента и OpenSSL для musl query engine на Alpine 3.23) — см. `specs/001-personal-landing-page/tasks.md` T043 для деталей. Визуальную проверку виджета в браузере (`http://localhost:5173`) пользователь выполняет самостоятельно — не завершена в рамках этой сессии (прервана пользователем до визуальной проверки фронтенд-контейнера)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей — можно начинать сразу
- **Foundational (Phase 2)**: зависит от завершения Setup — БЛОКИРУЕТ все user story
- **User Stories (Phase 3+)**: все зависят от завершения Foundational
  - US1 (T022-T024) и US2 (T025-T027) не зависят друг от друга — можно вести параллельно
  - US3 (T028-T030) логически идёт последним (сверка перенесённых данных), но не имеет жёсткой технической зависимости от US1/US2
- **Polish (Phase 6)**: зависит от желаемых user story (минимум US1 для T031)

### Within Each User Story

- US1: T022 → T023 (тест) может идти параллельно с T022 после его завершения; T024 (ручная загрузка в MinIO) независима от кода и может выполняться в любой момент после Setup (T003)
- US2: T025 → T026 (тест); T027 — ручная проверка после T025
- US3: T028, T029 могут идти параллельно; T030 — после обоих

### Parallel Opportunities

- Setup: T002, T003, T004 — параллельно после T001
- Foundational: T007, T010, T011 (после T007), T014 (после T006), T015, T016 (после T004) — параллельно, где нет прямой зависимости
- После Foundational: US1 и US2 можно вести параллельно (разные файлы, разные аспекты)
- Внутри US1: T023 параллельно с T024
- Внутри US3: T028 параллельно с T029

---

## Parallel Example: Foundational phase

```bash
# После T005-T006 (модель + миграция) — параллельно:
Task: "Создать PrismaService в apps/backend/src/prisma/prisma.service.ts"          # T007
Task: "Создать GraphQL-тип Project в apps/backend/src/projects/models/project.model.ts"  # T010
Task: "Добавить DTO Project в packages/shared-types/src/project.ts"                # T015
Task: "Создать seed.ts с upsert для himnavigator и placeholder"                    # T014
```

## Parallel Example: User Story 1

```bash
Task: "Обновить ProjectCard.tsx — добавить CardMedia для imageUrl"        # T022
Task: "Вручную загрузить chmtch-screen.PNG в бакет MinIO"                  # T024 (не зависит от T022)
# После завершения T022:
Task: "Юнит-тест рендера изображения в ProjectCard.test.tsx"              # T023
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Завершить Phase 1: Setup
2. Завершить Phase 2: Foundational (КРИТИЧНО — блокирует все user story)
3. Завершить Phase 3: User Story 1 (изображения в карточках)
4. **Остановиться и проверить**: User Story 1 независимо (см. Independent Test выше)

### Incremental Delivery

1. Setup + Foundational → список проектов из БД уже рендерится (текстом)
2. - User Story 1 → изображения в карточках (MVP)
3. - User Story 2 → подтверждена возможность менять данные без релиза
4. - User Story 3 → подтверждено отсутствие регрессии контента после переноса
5. Polish → финальная зачистка и сквозной прогон quickstart.md

## Notes

- [P] задачи = разные файлы, нет зависимости друг от друга
- Каждая user story независимо завершаема и проверяема (см. Independent Test в каждой фазе)
- Коммит — после каждой задачи или логической группы задач (Conventional Commits, принцип II)
- Избегать: расплывчатых задач, конфликтов на одном файле, кросс-стори зависимостей, ломающих независимость
