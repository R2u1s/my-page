---
description: "Task list template for feature implementation"
---

# Tasks: Персональный лендинг-визитка

**Input**: Design documents from `/specs/001-personal-landing-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Тесты не запрошены явно в спецификации — тестовые задачи не включены.

**Organization**: Задачи сгруппированы по пользовательским историям (US1–US3 из spec.md). Счётчик посещений
(FR-010) и backend-заготовка (FR-013/FR-014) не привязаны к конкретной приоритетной истории — вынесены в
отдельные сквозные фазы.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: US1 (Hero), US2 (Навыки), US3 (Проекты)
- Указаны точные пути к файлам

## Path Conventions

Монорепозиторий (см. `plan.md` → Project Structure): `apps/frontend/src/...`, `apps/backend/src/...`,
`packages/shared-types/...`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Инициализация pnpm-монорепозитория и базовой конфигурации

- [x] T001 Создать корень монорепозитория: `package.json` (workspaces), `pnpm-workspace.yaml`
      (`apps/*`, `packages/*`), `.gitignore`, базовый корневой `tsconfig.base.json` со `strict: true`
- [x] T002 [P] Настроить единый ESLint + Prettier конфиг в корне (`.eslintrc.cjs`, `.prettierrc`),
      с точечными override-секциями для FSD-границ импортов (frontend) и NestJS-декораторов (backend)
- [x] T003 [P] Настроить Husky pre-commit хук в корне (`.husky/pre-commit`) с `lint-staged`, блокирующий
      коммит при ошибках линтера
- [x] T004 Создать `apps/frontend` (Vite + React + TypeScript strict) с базовым `package.json`,
      `vite.config.ts`, `tsconfig.json` (extends корневой)
- [x] T005 Создать `apps/backend` (NestJS, TypeScript strict) с базовым `package.json`, `tsconfig.json`
      (extends корневой), `src/main.ts`
- [x] T006 [P] Создать `packages/shared-types` с `package.json` и `src/index.ts` (пока пустой экспорт,
      заготовка для общих типов, например ответа `/health`)
- [x] T007 Создать `docker-compose.yml` в корне с сервисами `frontend`, `backend`, `postgres`
      (порты, volumes, env, `healthcheck` для `backend` через `GET /health`) и `Dockerfile` для
      `apps/frontend` и `apps/backend`

**Checkpoint**: Монорепозиторий устанавливается (`pnpm install`) и линтер запускается без ошибок конфигурации

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Общая инфраструктура фронтенда и бэкенда, без которой ни одна пользовательская история не может
быть реализована

**⚠️ CRITICAL**: Ни одна из фаз User Story 1–3 не начинается до завершения этой фазы

- [x] T008 Установить MUI + Emotion в `apps/frontend` и создать тёмную тему проекта в
      `apps/frontend/src/app/providers/theme/theme.ts` (`palette.mode: 'dark'`,
      `palette.background.default: '#1f1f1f'`, базовая типографика и breakpoints)
- [x] T009 Подключить `ThemeProvider` + `CssBaseline` один раз в
      `apps/frontend/src/app/providers/theme/index.tsx` и обернуть корневой `apps/frontend/src/app/App.tsx`
- [x] T010 Создать скелет слоёв FSD в `apps/frontend/src/` (`app/`, `pages/`, `widgets/`, `entities/`,
      `shared/`) с `index.ts` барр елями в каждом слое и ESLint-правилом, запрещающим импорт из вышестоящего
      слоя (дополнение к T002)
- [x] T011 [P] Установить `react-icons` в `apps/frontend` (пакет `si`/Simple Icons для логотипов технологий)
- [x] T012 [P] Установить TanStack React Query в `apps/frontend` и создать провайдер
      `apps/frontend/src/shared/api/queryClient.ts` + `QueryClientProvider` в `apps/frontend/src/app/App.tsx`
- [x] T013 [P] Создать `apps/frontend/src/shared/ui/` с базовыми `styled()`-компонентами для секции
      (`SectionContainer`, `SectionTitle`) на основе темы, без хардкода цветов/отступов
- [x] T014 Разместить предоставленную фотографию профиля в
      `apps/frontend/src/shared/assets/profile-photo.png`
- [x] T015 Настроить `AppModule` в `apps/backend/src/app.module.ts` (корневая точка сборки backend-модулей)
- [x] T016 [P] Настроить Prisma в `apps/backend`: `apps/backend/prisma/schema.prisma` только с блоками
      `generator`/`datasource` (без доменных `model`, см. `research.md` п.6), `apps/backend/.env.example`
      с `DATABASE_URL`
- [x] T017 [P] Подключить `@nestjs/graphql` (code-first, `autoSchemaFile`) в
      `apps/backend/src/graphql/graphql.module.ts` и импортировать в `AppModule`

**Checkpoint**: Тема и FSD-скелет фронтенда готовы; backend поднимается локально с пустым GraphQL-модулем —
можно параллельно приступать к фазам пользовательских историй

---

## Phase 3: User Story 1 - Быстрое знакомство с профилем (Priority: P1) 🎯 MVP

**Goal**: Посетитель сразу видит имя, профессию и фото, не прокручивая страницу, на desktop и mobile

**Independent Test**: Открыть страницу на desktop и на mobile-ширине — hero-блок с именем, профессией и фото
виден без скролла, без горизонтальной прокрутки

### Implementation for User Story 1

- [x] T018 [P] [US1] Создать конфиг `entities/profile` в `apps/frontend/src/entities/profile/model/config.ts`
      с типом `Profile` (`firstName`, `lastName`, `role`, `photoSrc`, `photoAlt`, `experienceSummary`,
      `stackSummary`) и значением из спецификации ("Руслан", "Буданов", "Fullstack-разработчик", фото из T014)
- [x] T019 [US1] Реэкспортировать публичный API сущности в `apps/frontend/src/entities/profile/index.ts`
      (только тип и конфиг, без внутренних деталей)
- [x] T020 [US1] Реализовать виджет `widgets/hero` в
      `apps/frontend/src/widgets/hero/ui/HeroSection.tsx`: текстовый блок слева (имя крупным `Typography`,
      профессия — `Typography` меньшего размера) и фото справа, через `sx`/`styled()` с responsive-раскладкой
      MUI breakpoints (`flexDirection: {xs: 'column', md: 'row'}`)
- [x] T021 [US1] Обработать fallback для отсутствующего изображения в `HeroSection.tsx` (`onError` +
      `useState` скрывают фото-колонку целиком, если `photoUrl` не загрузился, текстовый блок остаётся по
      центру — Edge Case из spec.md; реализовано иначе, чем изначально описано в задаче, — обновлено
      задним числом под фактическое поведение)
- [x] T022 [US1] Реэкспортировать виджет в `apps/frontend/src/widgets/hero/index.ts`
- [x] T023 [US1] Создать страницу `pages/landing` в `apps/frontend/src/pages/landing/ui/LandingPage.tsx`,
      подключить `HeroSection`, и корневой `apps/frontend/src/app/App.tsx` рендерит только эту страницу
      (без роутера — соответствует FR-001)

**Checkpoint**: Hero-блок полностью функционален и проходит Independent Test самостоятельно

---

## Phase 4: User Story 2 - Оценка опыта и стека технологий (Priority: P2)

**Goal**: Посетитель видит текст об опыте/месте работы и список технологий с иконками

**Independent Test**: Прокрутить страницу до блока навыков — виден текст об опыте и список технологий,
каждая — с иконкой

### Implementation for User Story 2

- [x] T024 [P] [US2] Создать конфиг `entities/skill` в `apps/frontend/src/entities/skill/model/config.ts` с
      типом `Skill` (`id`, `label`, `Icon: IconType`) и списком: Javascript (`SiJavascript`), TypeScript
      (`SiTypescript`), React (`SiReact`), Nest.js (`SiNestjs`) из `react-icons/si`
- [x] T025 [US2] Реэкспортировать публичный API в `apps/frontend/src/entities/skill/index.ts`
- [x] T026 [US2] Реализовать виджет `widgets/skills` в
      `apps/frontend/src/widgets/skills/ui/SkillsSection.tsx`: текст `experienceSummary`/`stackSummary` из
      `entities/profile` + список технологий из `entities/skill` (иконка + подпись) в адаптивной сетке
      (MUI `Grid`/`Stack` с responsive breakpoints)
- [x] T027 [US2] Реэкспортировать виджет в `apps/frontend/src/widgets/skills/index.ts`
- [x] T028 [US2] Подключить `SkillsSection` в `apps/frontend/src/pages/landing/ui/LandingPage.tsx` сразу
      после `HeroSection`

**Checkpoint**: Hero + блок навыков работают вместе, блок навыков независимо проходит Independent Test

---

## Phase 5: User Story 3 - Просмотр портфолио проектов (Priority: P3)

**Goal**: Посетитель видит карточки проектов с описанием и рабочей внешней ссылкой (+ карточку-заглушку)

**Independent Test**: Прокрутить до блока проектов — карточка "Навигатор Химии" открывает ссылку в новой
вкладке, карточка-заглушка отображает текст "Список будет дополняться" без ссылки

### Implementation for User Story 3

- [x] T029 [P] [US3] Создать конфиг `entities/project` в
      `apps/frontend/src/entities/project/model/config.ts` с типом `Project` (`id`, `title`, `description`,
      `url: string | null`, `isPlaceholder: boolean`) и двумя записями: "Навигатор Химии" (с описанием из
      spec.md, `url` — реальная ссылка проекта, `isPlaceholder: false`) и заглушка "Список будет
      дополняться" (`url: null`, `isPlaceholder: true`)
- [x] T030 [US3] Реэкспортировать публичный API в `apps/frontend/src/entities/project/index.ts`
- [x] T031 [US3] Реализовать карточку `entities/project/ui/ProjectCard.tsx` (MUI `Card`): для
      `isPlaceholder: false` — заголовок, описание и ссылка с `component="a"`, `target="_blank"`,
      `rel="noopener noreferrer"`; для `isPlaceholder: true` — некликабельная карточка с приглушённым
      оформлением и текстом-заглушкой
- [x] T032 [US3] Реализовать виджет `widgets/projects` в
      `apps/frontend/src/widgets/projects/ui/ProjectsSection.tsx`, рендерящий список `ProjectCard` по
      конфигу `entities/project` в адаптивной сетке карточек
- [x] T033 [US3] Реэкспортировать виджет в `apps/frontend/src/widgets/projects/index.ts`
- [x] T034 [US3] Подключить `ProjectsSection` в `apps/frontend/src/pages/landing/ui/LandingPage.tsx` сразу
      после `SkillsSection`

**Checkpoint**: Все три пользовательские истории (Hero → Навыки → Проекты) работают вместе на одной странице

---

## Phase 6: Счётчик посещений и сборка страницы (FR-010, cross-cutting)

**Purpose**: Счётчик посещений — заглушка, не привязанная к отдельной пользовательской истории, замыкает
структуру страницы сверху вниз

- [x] T035 [P] Создать конфиг `entities/visit-counter` в
      `apps/frontend/src/entities/visit-counter/model/config.ts` с типом `VisitCounter` (`value: number`,
      `label: string`) и статичным значением-заглушкой
- [x] T036 Реэкспортировать публичный API в `apps/frontend/src/entities/visit-counter/index.ts`
- [x] T037 Реализовать виджет `widgets/visit-counter` в
      `apps/frontend/src/widgets/visit-counter/ui/VisitCounterSection.tsx`, отображающий значение и подпись
      из конфига в некликабельном, визуально нейтральном блоке (не похожем на кнопку — Edge Case из spec.md)
- [x] T038 Реэкспортировать виджет в `apps/frontend/src/widgets/visit-counter/index.ts` и подключить
      `VisitCounterSection` последним блоком в `apps/frontend/src/pages/landing/ui/LandingPage.tsx`

**Checkpoint**: Страница полностью собрана в порядке Hero → Навыки → Проекты → Счётчик

---

## Phase 7: Backend платформа — health-check и GraphQL-заглушка (FR-013/FR-014, cross-cutting)

**Purpose**: Техническая инфраструктура backend, не влияющая на видимый контент лендинга

- [x] T039 [P] Реализовать `HealthModule` в `apps/backend/src/health/health.module.ts`,
      `apps/backend/src/health/health.controller.ts` (`GET /health` → `{ status: 'ok' }`) и
      `apps/backend/src/health/health.service.ts` (тонкий контроллер делегирует сервису — принцип V
      конституции); подключить модуль в `AppModule`
- [x] T040 [P] Реализовать заглушечный резолвер `apps/backend/src/graphql/app.resolver.ts` с единственным
      `@Query(() => String) ping(): string` (возвращает `'ok'`), зарегистрировать в `AppModule` — см.
      `contracts/graphql-stub.md`

**Checkpoint**: `curl localhost:<port>/health` возвращает `200 {"status":"ok"}`; GraphQL-запрос `{ ping }`
возвращает `{"data":{"ping":"ok"}}`, доменных query/mutation в схеме нет

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Финальная проверка адаптивности, докер-стека и соответствия quickstart-сценариям

- [x] T041 [P] Прогнать `apps/frontend` через desktop и mobile breakpoints (DevTools эмуляция ≤375px и
      ≥1280px), устранить горизонтальную прокрутку/обрезание текста (SC-004)
- [x] T042 Проверить, что весь текстовый и структурный контент страницы читается исключительно из
      `entities/*` конфигов (нет захардкоженных строк в `widgets`/`pages`) — ручной аудит по FR-011/SC-002
      — ⚠ **устарело**: после добавления кнопки "контакты" в `HeroSection.tsx` текст `"контакты"`
      захардкожен в компоненте в обход `entities/profile` — см. T045
- [ ] T043 Проверить полный подъём стека через `docker compose up` (frontend, backend, postgres,
      healthcheck backend зелёный) — **не выполнено**: Docker Desktop недоступен в текущей
      (headless) среде выполнения; frontend/backend по отдельности проверены через `pnpm dev`/`start:dev`
      и production-сборки (`pnpm build`), но полный docker-compose стек требует ручной проверки на
      машине с запущенным Docker Desktop
- [x] T044 Пройти все сценарии из `specs/001-personal-landing-page/quickstart.md` вручную и зафиксировать
      результат

---

## Phase 9: Кнопка "контакты" в hero — соответствие FR-015/принципу IV (tech debt)

**Purpose**: `HeroSection.tsx` получил кнопку-заглушку "контакты" (FR-015) в обход конфигов и темы —
привести реализацию в соответствие с FR-011 и принципом IV конституции

- [ ] T045 [P] Добавить поле `contactLabel` в тип `ProfileInfo` и конфиг `entities/profile`
      (`apps/frontend/src/entities/profile/model/config.ts`, значение `"контакты"`); заменить
      захардкоженный текст кнопки в `apps/frontend/src/widgets/hero/ui/HeroSection.tsx` на
      `profile.contactLabel`
- [ ] T046 [P] Вынести акцентный цвет `#d37336` (и hover-оттенок `#e88344`) в `theme.palette` (например,
      `palette.accent` или `palette.secondary`) в `apps/frontend/src/app/providers/theme/theme.ts`;
      заменить хардкод цветов кнопки и rgba-оттенков белого (`rgba(255,255,255,0.35)`,
      `rgba(255,255,255,0.7)`) в `HeroSection.tsx` на значения из темы
- [ ] T047 Вынести шрифт `'Inter'` в `theme.typography` (например, `typography.h1.fontFamily`) вместо
      хардкода `fontFamily: "'Inter', sans-serif"` в `HeroSection.tsx`
- [ ] T048 Повторно пройти ручной аудит FR-011/SC-002 (аналог T042) по всей странице после T045–T047

**Checkpoint**: `HeroSection.tsx` не содержит захардкоженных строк/цветов/шрифтов, кнопка "контакты"
задокументирована как FR-015

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей — можно начинать сразу
- **Foundational (Phase 2)**: зависит от завершения Phase 1 — БЛОКИРУЕТ все пользовательские истории
- **User Stories (Phase 3–5)**: все зависят от завершения Foundational; между собой независимы и могут идти
  параллельно (или последовательно по приоритету P1 → P2 → P3)
- **Phase 6 (Счётчик)**: зависит только от Foundational (использует ту же тему/FSD-скелет), не зависит от
  Phase 3–5 по данным, но по вёрстке подключается последним в `LandingPage.tsx` — рекомендуется выполнять
  после Phase 5, чтобы не создавать конфликтов на одном файле (`LandingPage.tsx`)
- **Phase 7 (Backend)**: зависит только от Foundational (T015–T017); полностью независим от Phase 3–6
  (можно выполнять параллельно фронтенд-командой)
- **Phase 8 (Polish)**: зависит от завершения всех предыдущих фаз

### Within Each User Story

- Конфиг `entities/*` → виджет `widgets/*` → подключение в `pages/landing/ui/LandingPage.tsx`
- Подключение в `LandingPage.tsx` выполняется строго после T023 (US1 создаёт файл страницы), поэтому T028,
  T034, T038 — последовательные правки одного файла, не параллельны друг другу

### Parallel Opportunities

- Все задачи Phase 1 с пометкой [P] — параллельно (T002, T003, T006)
- В Phase 2: T011, T012, T013, T016, T017 — параллельно (разные файлы/пакеты)
- После Foundational: Phase 3, Phase 4, Phase 5 и Phase 7 могут вестись параллельно разными
  разработчиками; конфиги T018, T024, T029, T035 — параллельно друг с другом
- Phase 7 (T039, T040) полностью параллельна фронтенд-фазам (3–6)

---

## Parallel Example: после Foundational

```bash
# Конфиги entities параллельно (разные файлы):
Task: "Создать entities/profile config в apps/frontend/src/entities/profile/model/config.ts"
Task: "Создать entities/skill config в apps/frontend/src/entities/skill/model/config.ts"
Task: "Создать entities/project config в apps/frontend/src/entities/project/model/config.ts"
Task: "Создать entities/visit-counter config в apps/frontend/src/entities/visit-counter/model/config.ts"

# Backend-заготовка параллельно фронтенду:
Task: "Реализовать HealthModule в apps/backend/src/health/"
Task: "Реализовать GraphQL-заглушку в apps/backend/src/graphql/app.resolver.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup
2. Phase 2: Foundational (блокирует всё остальное)
3. Phase 3: User Story 1 (Hero)
4. **СТОП и ПРОВЕРКА**: hero-блок самостоятельно проходит Independent Test на desktop/mobile
5. Показать заказчику как MVP-визитку

### Incremental Delivery

1. Setup + Foundational → фундамент готов
2. - User Story 1 (Hero) → проверить независимо → MVP
3. - User Story 2 (Навыки) → проверить независимо
4. - User Story 3 (Проекты) → проверить независимо
5. - Phase 6 (Счётчик) и Phase 7 (Backend) → завершение объёма фичи
6. Phase 8 (Polish) → финальная валидация по quickstart.md

## Notes

- [P] задачи — разные файлы, нет зависимостей друг от друга
- Метка [Story] проставлена только для задач фаз 3–5 (US1–US3), как того требует формат
- Счётчик посещений (Phase 6) и backend-заготовка (Phase 7) не привязаны к приоритетным историям — это
  сквозные требования FR-010/FR-013/FR-014, не описанные как отдельный пользовательский сценарий в spec.md
- Тестовые задачи не включены — не запрошены явно в спецификации
