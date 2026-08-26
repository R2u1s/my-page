# Quickstart: Проекты из постоянного хранилища данных с изображениями

## Prerequisites

- Docker + Docker Compose установлены (сервисы `postgres`, `minio`, `backend`, `frontend`)
- Node.js LTS и pnpm — только для запуска Prisma-миграции/сида и локальной разработки без Docker

## Запуск стека

```bash
docker compose up
```

Поднимает `postgres`, новый сервис `minio` (S3-совместимое API на `:9000`, консоль на `:9001`), `backend`,
`frontend` — см. `research.md`, п.5.

## Разовая настройка бакета MinIO (только при первом запуске)

1. Открыть консоль MinIO: `http://localhost:9001`, войти под учётными данными из `docker-compose.yml`
   (`MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD`).
2. Создать бакет (фактически использован `my-page`).
3. Установить для бакета публичную политику на чтение (вкладка Anonymous/Access Rules → Prefix `*` →
   Access `readonly`, либо CLI `mc anonymous set download local/<bucket>`) — простого переключения
   "private → public" в UI недостаточно, нужна именно anonymous-политика на чтение объектов, иначе
   изображения не откроются в браузере посетителя (см. `research.md`, п.6).
4. Загрузить файл `apps/frontend/src/shared/assets/chmtch-screen.PNG` в бакет — через консоль (drag&drop)
   или CLI `mc`. Регистр расширения (`.PNG`) сохраняется как есть — S3-ключи регистрозависимы.
5. Проверить, что файл открывается по прямой ссылке (фактически):
   `http://localhost:9000/my-page/chmtch-screen.PNG`.

## Миграция схемы и перенос данных

```bash
pnpm --filter backend exec prisma migrate dev --name add-project
pnpm --filter backend exec prisma db seed
```

**Ожидаемо**: в таблице `Project` появляются ровно две записи — `himnavigator` и `placeholder` (см.
`data-model.md`, раздел "Миграция данных"). Повторный запуск `prisma db seed` не создаёт дублей (upsert по
`id`).

## Валидация: GraphQL отдаёт перенесённые проекты

```bash
curl -s http://localhost:3001/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"query { projects { id title url imageUrl isPlaceholder } }"}'
```

(порт `3001` — при запуске через `docker compose up`; при локальном `pnpm dev:backend` — `3000`, см.
`research.md`, п.7)

**Ожидаемо**: ответ содержит обе записи в порядке `himnavigator`, затем `placeholder` — см.
`contracts/graphql-projects.md`.

## Валидация: блок "Проекты" на лендинге (User Story 1, 3)

1. Открыть `http://localhost:5173`, прокрутить до блока "Проекты".
2. **Ожидаемо**: карточка "Навигатор Химии" отображает загруженное изображение вместе с описанием и рабочей
   ссылкой (открывается в новой вкладке); карточка-заглушка "Список будет дополняться" отображается без
   изображения, без визуальных дефектов.

## Валидация: изменение данных без правки кода (User Story 2, SC-001)

1. Через Prisma Studio (`pnpm --filter backend exec prisma studio`) или напрямую в БД изменить `description`
   у записи `himnavigator`.
2. Обновить страницу лендинга в браузере (без перезапуска/пересборки фронтенда).
3. **Ожидаемо**: изменение отображается сразу же.

## Валидация: устойчивость к пустому/недоступному источнику данных (Edge Cases, SC-005)

1. Временно остановить сервис `backend` (`docker compose stop backend`) при открытой странице лендинга или
   при следующей её загрузке.
2. **Ожидаемо**: блок "Проекты" не приводит к падению всей страницы — отображает предусмотренное состояние
   ошибки/пустого списка, остальные блоки лендинга остаются работоспособны.
3. Запустить `backend` обратно (`docker compose start backend`) и обновить страницу — блок восстанавливается.
