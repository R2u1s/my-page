<!--
Sync Impact Report
===================
Version change: 1.0.0 → 1.0.1
Rationale for PATCH: clerical fix, no semantic change — Principle IV's heading and the
"Технологический стек" section erroneously said "CSS Modules" while the principle's own body
already mandated MUI + Emotion exclusively (CSS Modules explicitly forbidden). Corrected both to
say "MUI/Emotion" to match the body text. Found while reviewing HeroSection.tsx changes against
the constitution (2026-08-25).

Modified principles: IV heading text only (no rule change)

---
Version change: (unratified template) → 1.0.0
Rationale for MAJOR (initial ratification): first concrete adoption of the constitution for this
project — all placeholders replaced with binding principles, so it is treated as the genesis version.

Modified principles: none (initial creation; template placeholders replaced)
Added sections:
  - I. Монорепозиторий и строгая типизация
  - II. Git-дисциплина: Conventional Commits
  - III. Feature-Sliced Design на фронтенде
  - IV. Стилизация только через CSS Modules
  - V. Модульная архитектура backend и разделение ответственности
  - VI. GraphQL как единственный API-контракт
  - VII. Слой данных: Prisma и обязательные миграции
  - VIII. Доступ фронтенда к API только через query-слой
  - IX. Контейнеризация локальной среды
  - X. Простота: без избыточной инфраструктуры
  - Качество кода и автоматизация (Section 2)
  - Технологический стек (Section 3)
  - Governance (amendment procedure, versioning policy, compliance review)
Removed sections: none (template scaffold only)
Deferred / TODO placeholders: none — all bracket tokens resolved.

Templates requiring follow-up review (not modified by this command; verify at next use):
  - .specify/templates/plan-template.md — ⚠ pending manual check that "Constitution Check" gates
    reference the ten principles above (FSD layer boundaries, GraphQL-only, Prisma migrations,
    thin resolvers, TanStack Query via entities/shared api, no auth/roles/microservices).
  - .specify/templates/spec-template.md — ✅ no constitution-specific language, no changes needed.
  - .specify/templates/tasks-template.md — ⚠ pending manual check that task categorization supports
    per-package (apps/frontend, apps/backend, packages/shared-types) and migration-first ordering.
  - .specify/templates/checklist-template.md — ✅ generic, no changes needed.
-->

# Personal Landing Page Constitution

## Core Principles

### I. Монорепозиторий и строгая типизация

Проект — монорепозиторий на pnpm workspaces со следующими пакетами: `apps/frontend`,
`apps/backend`. TypeScript используется в строгом режиме (`"strict": true`) во всех пакетах без исключений; использование `any` должно быть минимизировано.

### II. Git-дисциплина: Conventional Commits

Все коммиты ОБЯЗАНЫ соответствовать спецификации Conventional Commits (`feat:`, `fix:`, `docs:`,
`chore:`, `refactor:`, `test:`, `build:`, `ci:`). Сообщение коммита — источник данных для
автогенерации changelog и для триггера автоматической синхронизации документации.

### III. Feature-Sliced Design на фронтенде

Frontend строится по методологии Feature-Sliced Design со слоями (сверху вниз):
`app → pages → widgets → features → entities → shared`. Правило направления импортов соблюдается
строго: слой НЕ МОЖЕТ импортировать что-либо из вышележащего слоя (например, `entities` не
импортирует из `features` или `widgets`; `shared` не знает ни об одном другом слое).

### IV. Стилизация только через MUI/Emotion

- UI-библиотека: Material UI (MUI), актуальная стабильная версия на момент старта проекта
- Стилизация исключительно через встроенные механизмы MUI:
  - sx-prop — для точечных, локальных стилей внутри компонента
  - styled() (на основе Emotion) — для переиспользуемых кастомных компонентов
    и нестандартной вёрстки (кастомные layout-сетки, сложные композиции)
  - ThemeProvider с единой темой проекта (палитра, типографика, breakpoints,
    spacing) — конфиг темы лежит в shared/theme (слой shared в FSD) и
    подключается один раз в app-слое (корневой Provider)
- CSS Modules, обычный CSS и любые другие CSS-in-JS решения не используются —
  единственный источник стилизации — MUI + Emotion
- Design tokens (цвета, шрифты, отступы) не хардкодятся в компонентах —
  берутся из темы MUI (theme.palette, theme.spacing, theme.typography и т.д.)
- Библиотека иконок для брендовых логотипов технологий (react-icons / simple-icons)
  используется отдельно от MUI Icons — MUI Icons содержит только Material Design
  иконки, не подходит для логотипов технологий (React, Docker, GraphQL и т.п.)
- Адаптивность реализуется через встроенную систему breakpoints MUI
  (useMediaQuery / sx с responsive-значениями), а не через ручные media-запросы
- Глобальные стили (сброс браузерных стилей, базовые настройки шрифта) —
  через CssBaseline из MUI, отдельный global.css файл не создаётся

### V. Модульная архитектура backend и разделение ответственности

Backend строится на NestJS с одним модулем (`*.module.ts`) на каждую функциональную область.
Резолверы (`*.resolver.ts`) НЕ СОДЕРЖАТ бизнес-логики — они только принимают запрос, делегируют
вызов соответствующему сервису (`*.service.ts`) и возвращают результат. Вся бизнес-логика,
валидация и оркестрация работы с данными инкапсулируются исключительно в сервисах.

Rationale: тонкие резолверы позволяют тестировать бизнес-логику в изоляции от GraphQL-слоя и
переиспользовать сервисы вне контекста запроса (скрипты, задачи, будущие интеграции).

### VI. GraphQL как единственный API-контракт

Взаимодействие клиент–сервер осуществляется через GraphQL API, реализованный на `@nestjs/graphql` (декораторы `@ObjectType`, `@InputType`, `@Resolver`, `@Query`, `@Mutation`; схема генерируется из кода, а не пишется вручную). REST-эндпоинты
не используются, единственное исключение — `GET /health` для проверки живости сервиса (readiness/
liveness, мониторинг, healthcheck контейнера).

### VII. Слой данных: Prisma и обязательные миграции

Доступ к PostgreSQL осуществляется ИСКЛЮЧИТЕЛЬНО через Prisma ORM. Схема данных хранится в
единственном файле `apps/backend/prisma/schema.prisma`. Любое изменение схемы ОБЯЗАНО
сопровождаться сгенерированной миграцией (`prisma migrate dev` при разработке, `prisma migrate
deploy` при выкатке); ручное изменение структуры БД в обход миграций запрещено. Прямые SQL-запросы
в обход Prisma Client не допускаются, кроме задокументированных в коде исключений (например,
`$queryRaw` для агрегатов, не выражаемых через Prisma Client).

### VIII. Доступ фронтенда к API только через query-слой

Компоненты представления (`pages`, `widgets`, `features` в части UI) НЕ ОБРАЩАЮТСЯ к API
напрямую. Все сетевые запросы к GraphQL API инкапсулируются в `entities/<сущность>/api` (для
доменных сущностей) или `shared/api` (для сквозной инфраструктуры: GraphQL-клиент, общие хуки,
базовые типы запросов) и используют TanStack React Query (`useQuery`/`useMutation`) для
кеширования, инвалидации и управления состояниями загрузки/ошибки.

### IX. Контейнеризация локальной среды

Локальная разработка воспроизводится через Docker и docker-compose: сервисы `frontend`,
`backend`, `postgres` поднимаются одной командой (`docker compose up`). Конфигурация окружения
(переменные, порты, volumes, healthcheck) версионируется вместе с кодом; docker-compose —
обязательный и единственный поддерживаемый способ локального запуска полного стека.

## Качество кода и автоматизация

ESLint и Prettier ОБЯЗАТЕЛЬНЫ для всех пакетов монорепозитория с единой корневой конфигурацией;
пакеты (`apps/frontend`, `apps/backend`) наследуют общие правила,
переопределяя только специфичное для FSD (границы слоёв) и NestJS (декораторы, DI). Husky
настраивает pre-commit хук, который прогоняет lint (и typecheck, где применимо) на изменённых
файлах перед созданием коммита; коммит, не проходящий линтер, ОБЯЗАН блокироваться.

При изменении публичных контрактов (GraphQL-схема, состав пакетов монорепозитория, переменные
окружения, конфигурация docker-compose) синхронизация проектной документации (README, схема
архитектуры) ОБЯЗАТЕЛЬНА и обеспечивается автоматизацией: git-хуком и/или шагом CI, который либо
обновляет документацию генерацией из кода (например, экспорт GraphQL SDL, дерево пакетов), либо
блокирует merge при обнаруженном расхождении между кодом и документацией.

## Технологический стек

- **Монорепо**: pnpm workspaces — `apps/frontend`, `apps/backend`, `packages/shared-types`.
- **Frontend**: React 18+, Feature-Sliced Design, MUI (Material UI) + Emotion, TanStack React Query.
- **Backend**: NestJS, один модуль на функциональную область.
- **API**: GraphQL (code-first, `@nestjs/graphql`); REST — только `GET /health`.
- **ORM/БД**: Prisma + PostgreSQL; миграции обязательны; схема — `apps/backend/prisma/schema.prisma`.
- **Контейнеризация**: Docker + docker-compose (`frontend`, `backend`, `postgres`) для локальной
  разработки.
- **Качество кода**: ESLint + Prettier (единая конфигурация на монорепо), Husky pre-commit хуки.
- **TypeScript**: strict mode во всех пакетах; `any` минимизирован.

**Version**: 1.0.1 | **Ratified**: 2026-08-24 | **Last Amended**: 2026-08-25
