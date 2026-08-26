# Phase 0 Research: Персональный лендинг-визитка

Все пункты Technical Context зафиксированы конституцией проекта (`.specify/memory/constitution.md`) без
`NEEDS CLARIFICATION`. Ниже — обоснование конкретных технических решений для этой фичи.

## 1. Инструмент сборки фронтенда

- **Decision**: Vite + `@vitejs/plugin-react` для `apps/frontend`.
- **Rationale**: Быстрый dev-сервер и HMR, минимальная конфигурация, естественно сочетается с pnpm workspaces
  и TypeScript strict mode; не входит в противоречие ни с одним принципом конституции (стек не фиксирует
  конкретный бандлер).
- **Alternatives considered**: Create React App (устарел, не поддерживается), Next.js (даёт роутинг между
  страницами и SSR — избыточно и прямо противоречит FR-001 "без роутинга между страницами" и принципу X
  "простота: без избыточной инфраструктуры").

## 2. Иконки технологий

- **Decision**: `react-icons` (набор `si` — Simple Icons) для логотипов JavaScript, TypeScript, React, Nest.js.
- **Rationale**: Явно указано в конституции (принцип IV) как источник брендовых иконок, отдельно от MUI Icons;
  один пакет вместо двух отдельных (`react-icons` уже реэкспортирует набор Simple Icons).
- **Alternatives considered**: Прямое подключение `simple-icons` (SVG-файлы) — больше ручной работы с версткой
  без выигрыша, при том что `react-icons` уже даёт готовые React-компоненты этих же иконок.

## 3. Тёмная тема MUI

- **Decision**: `createTheme({ palette: { mode: 'dark', background: { default: '#1f1f1f' } } })`, подключается
  один раз в `app/providers/theme` через `ThemeProvider` + `CssBaseline`.
- **Rationale**: Прямое требование принципа IV конституции (тема — единственный источник design tokens,
  `CssBaseline` — единственный способ сброса базовых стилей).
- **Alternatives considered**: Ручной `background: '#1f1f1f'` через инлайн-стили в каждом компоненте —
  запрещено конституцией (хардкод design tokens вне темы).

## 4. Заглушечная GraphQL-схема

- **Decision**: Минимальный `AppResolver` с одним `@Query(() => String) ping()`, возвращающим статичную строку
  (например, `"ok"`), плюс пустой `AppModule`, использующий `GraphQLModule.forRoot()` (code-first,
  `autoSchemaFile`). Не используется фронтендом на этом этапе.
- **Rationale**: `@nestjs/graphql` в code-first режиме не может сгенерировать валидную схему совсем без единой
  операции (GraphQL-спецификация требует непустой тип `Query`); минимальный no-op query — стандартный паттерн
  для "заглушки" схемы, соответствующий FR-014 (нет реальных операций чтения/записи).
- **Alternatives considered**: Полностью не поднимать `GraphQLModule` до появления первой реальной сущности —
  отклонено, так как конституция (принцип VI) требует, чтобы GraphQL уже был единственным API-контрактом
  проекта с первого коммита backend, а не добавлялся позже.

## 5. Health-check эндпоинт

- **Decision**: `HealthController` с `GET /health`, возвращающий `{ status: 'ok' }`, без внешних зависимостей
  (`@nestjs/terminus` не требуется, т.к. на этом этапе нет реальных проверяемых зависимостей вроде БД-соединения
  с доменными данными).
- **Rationale**: Простейшая реализация, достаточная для readiness/liveness проверок контейнера согласно
  принципу VI (единственное исключение из GraphQL-only) и принципу X (простота).
- **Alternatives considered**: `@nestjs/terminus` с проверкой соединения Prisma/Postgres — отложено: на этом
  этапе Prisma-схема не содержит доменных моделей, а сам сервис Postgres поднимается по конституции (принцип
  IX) заранее, впрок для будущих фич.

## 6. Prisma-схема на этом этапе

- **Decision**: `apps/backend/prisma/schema.prisma` с только `generator` и `datasource` блоками, без
  доменных `model`-блоков; миграции не генерируются (нечего мигрировать).
- **Rationale**: FR-011 и Assumptions спецификации явно фиксируют, что весь контент лендинга — статичные
  frontend-конфиги, а не данные в БД. Принцип VII требует миграцию только "при изменении схемы данных" — схема
  не меняется, значит миграция не нужна.
- **Alternatives considered**: Заводить модель `VisitCounter` в БД уже сейчас — отклонено, т.к. счётчик прямо
  обозначен спецификацией как "заглушка... отдельная фича в будущем" (вне объёма этой фичи).

## 7. Тестирование

- **Decision**: Vitest + React Testing Library для `apps/frontend` (рендер виджетов по конфигам entities,
  проверка адаптивных breakpoint'ов через `@testing-library`), Jest (стандарт NestJS CLI) для `apps/backend`
  (unit-тест `HealthController`/`HealthService`, smoke-тест GraphQL-заглушки).
- **Rationale**: Vitest — стандарт для Vite-проектов (общая конфигурация, быстрый запуск); Jest поставляется
  "из коробки" с `@nestjs/cli` генератором проекта, что минимизирует дополнительную настройку.
- **Alternatives considered**: Jest для фронтенда тоже — рабочий вариант, но требует отдельной настройки
  трансформации под Vite-алиасы; Vitest выбран как более простой путь без доп. инфраструктуры (принцип X).

**Output**: все технические решения зафиксированы, `NEEDS CLARIFICATION` в Technical Context отсутствуют.
