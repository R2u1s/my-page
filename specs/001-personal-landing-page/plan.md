# Implementation Plan: Персональный лендинг-визитка

**Branch**: `001-personal-landing-page` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-landing-page/spec.md`

## Summary

Одностраничный тёмный лендинг-визитка (hero, навыки, проекты, счётчик-заглушка), весь контент вынесен в
конфиг-файлы слоя `entities` фронтенда. Бэкенд на этом этапе — только `GET /health` и заглушечная GraphQL-схема
(без реальных query/mutation), поднимаемые вместе с Postgres через docker-compose согласно конституции проекта.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) во всех пакетах монорепозитория

**Primary Dependencies**: React 18+, MUI (Material UI) + Emotion, TanStack React Query, react-icons (иконки
технологий); NestJS, `@nestjs/graphql` (code-first), Prisma ORM

**Storage**: PostgreSQL — поднимается через docker-compose согласно конституции, но эта фича не создаёт
доменных таблиц (данные лендинга статичны и хранятся во frontend-конфигах, не в БД)

**Testing**: Vitest + React Testing Library (frontend), Jest (backend, стандарт для NestJS) — smoke/unit
покрытие health-check эндпоинта и рендера блоков лендинга по конфигам

**Target Platform**: Веб (SSR не требуется), локальная разработка через Docker/docker-compose

**Project Type**: web-приложение (frontend + backend монорепозиторий)

**Performance Goals**: Стандартные ожидания для статичной маркетинговой SPA-страницы (быстрая первая отрисовка,
без тяжёлых сторонних скриптов)

**Constraints**: Строгий TypeScript; стилизация только через MUI/Emotion (без CSS Modules/сырого CSS); FSD-границы
импортов; резолверы без бизнес-логики; REST ограничен единственным `GET /health`

**Design tokens (hero)**: акцентный цвет `#d37336` (обводка кнопки-заглушки "контакты") и шрифт `'Inter'`
для заголовка hero введены при реализации `HeroSection`, но пока захардкожены в `sx`-пропах компонента, а не
вынесены в `theme.palette`/`theme.typography` — нарушение принципа IV конституции до выполнения задачи-долга
(см. `tasks.md`, Phase 9). Решение: зафиксировать оба значения как официальные токены темы проекта.

**Scale/Scope**: Одна страница, 4 контентных блока + счётчик-заглушка; один backend-модуль health-check +
пустой GraphQL-модуль

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Принцип конституции                                             | Применимость к фиче                                                                                                                                        | Статус                                                                                                                                                                                                |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Монорепо + строгий TypeScript                                | `apps/frontend`, `apps/backend` в pnpm workspaces, `strict: true`                                                                                          | PASS                                                                                                                                                                                                  |
| II. Conventional Commits                                        | Применяется на этапе коммитов реализации, не влияет на дизайн                                                                                              | PASS (процессное)                                                                                                                                                                                     |
| III. FSD на фронтенде                                           | Блоки лендинга — `widgets`, данные — `entities/*`, сборка страницы — `pages`/`app`                                                                         | PASS                                                                                                                                                                                                  |
| IV. Стилизация только MUI/Emotion                               | Тёмная тема (#1f1f1f) — через `ThemeProvider`, кастомные блоки — `styled()`, иконки технологий — react-icons (вне MUI Icons)                               | PASS (проектный дизайн); ⚠ FAIL по факту в текущей реализации `HeroSection` — акцентный цвет, `'Inter'` и rgba-оттенки белого захардкожены в `sx`, не взяты из темы; исправление — Phase 9 `tasks.md` |
| V. Модульный backend, тонкие резолверы                          | `HealthModule` (REST-контроллер) отдельно от `AppResolver`-заглушки GraphQL; резолвер без логики                                                           | PASS                                                                                                                                                                                                  |
| VI. GraphQL — единственный контракт, `GET /health` — исключение | Реализуем именно так: пустая/заглушечная GraphQL-схема + единственный REST `GET /health`                                                                   | PASS                                                                                                                                                                                                  |
| VII. Prisma + обязательные миграции                             | Эта фича не меняет схему данных (нет доменных сущностей в БД) → миграции не создаются; `schema.prisma` заводится пустым/базовым для будущих фич            | PASS (нет изменений схемы → нет new migration)                                                                                                                                                        |
| VIII. Фронтенд обращается к API только через query-слой         | На этом этапе реальных запросов к API нет (все данные — статичные конфиги); `shared/api` заготавливается для будущего health-check пинга, если потребуется | PASS                                                                                                                                                                                                  |
| IX. Docker/docker-compose для локальной среды                   | `docker-compose.yml` поднимает `frontend`, `backend`, `postgres` одной командой                                                                            | PASS                                                                                                                                                                                                  |
| X. Простота, без лишней инфраструктуры                          | Нет авторизации, ролей, микросервисов, реальных доменных таблиц — сознательно вне объёма                                                                   | PASS                                                                                                                                                                                                  |

Нарушений нет → раздел Complexity Tracking не заполняется.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-landing-page/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
my-page/
├── docker-compose.yml
├── package.json                 # pnpm workspaces root
├── pnpm-workspace.yaml
├── .eslintrc.cjs / .prettierrc  # единая конфигурация для монорепо
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/              # инициализация приложения, ThemeProvider, провайдеры
│   │   │   │   └── providers/theme/   # тема MUI (палитра #1f1f1f, типографика, breakpoints)
│   │   │   ├── pages/             # единственная страница landing (сборка виджетов)
│   │   │   ├── widgets/
│   │   │   │   ├── hero/
│   │   │   │   ├── skills/
│   │   │   │   ├── projects/
│   │   │   │   └── visit-counter/
│   │   │   ├── entities/
│   │   │   │   ├── profile/        # конфиг: имя, профессия, фото, текст об опыте
│   │   │   │   ├── skill/          # конфиг: список технологий + иконки
│   │   │   │   ├── project/        # конфиг: список карточек проектов (+ заглушка)
│   │   │   │   └── visit-counter/  # конфиг: статичное значение счётчика
│   │   │   └── shared/
│   │   │       ├── api/            # заготовка GraphQL-клиента / health-check запроса
│   │   │       ├── assets/         # фотография профиля
│   │   │       └── ui/             # переиспользуемые styled()-компоненты
│   │   └── tests/
│   └── backend/
│       ├── src/
│       │   ├── health/
│       │   │   ├── health.module.ts
│       │   │   └── health.controller.ts   # GET /health (единственный REST-эндпоинт)
│       │   ├── graphql/
│       │   │   ├── graphql.module.ts       # подключение @nestjs/graphql, code-first
│       │   │   └── app.resolver.ts         # заглушечный Query (placeholder-схема)
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma               # базовая схема без доменных моделей (для будущих фич)
│       └── test/
└── packages/
    └── shared-types/                        # общие TS-типы (например, ответ health-check)
```

**Structure Decision**: Вариант «Web application» (frontend + backend) в виде pnpm-monorepo с тремя пакетами
(`apps/frontend`, `apps/backend`, `packages/shared-types`), как зафиксировано в конституции проекта. Frontend
строится по FSD; вся контентная информация лендинга изолирована в слое `entities/*` в виде TS-конфигов, что
напрямую реализует требование FR-011 спецификации.

## Complexity Tracking

_Нарушений Constitution Check нет — раздел не заполняется._
