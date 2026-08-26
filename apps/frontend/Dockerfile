FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile --filter frontend...

COPY tsconfig.base.json ./
COPY apps/frontend apps/frontend
COPY packages/shared-types packages/shared-types

EXPOSE 5173
CMD ["pnpm", "--filter", "frontend", "dev", "--host"]
