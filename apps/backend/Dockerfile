FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile --filter backend...

COPY tsconfig.base.json ./
COPY apps/backend apps/backend
COPY packages/shared-types packages/shared-types

EXPOSE 3000
CMD ["pnpm", "--filter", "backend", "start:dev"]
