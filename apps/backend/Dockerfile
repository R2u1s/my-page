FROM node:20-alpine AS base
WORKDIR /repo
# Prisma's query engine (musl build) dynamically links libssl.so.1.1, which Alpine's own
# `openssl` package no longer ships (Alpine 3.23 base image) — without this, `prisma generate`
# succeeds at build time but the generated client fails at runtime with
# "Error loading shared library libssl.so.1.1: No such file or directory".
RUN apk add --no-cache openssl
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile --filter backend...

COPY tsconfig.base.json ./
COPY apps/backend apps/backend
COPY packages/shared-types packages/shared-types

# Generate the Prisma client at build time so the compiled `../../generated/prisma` module
# (imported by prisma.service.ts) exists before the app starts.
RUN pnpm --filter backend exec prisma generate

EXPOSE 3000
# Apply any pending migrations on container start, then boot the app — makes `docker compose up
# --build` work end-to-end on a fresh database without a separate manual `prisma migrate deploy`.
CMD ["sh", "-c", "pnpm --filter backend exec prisma migrate deploy && pnpm --filter backend start:dev"]
