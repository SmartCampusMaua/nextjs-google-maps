# Production image for @smartcampus/api (Elysia on Bun).
#
# Build from the REPO ROOT (this is a pnpm/turbo workspace, so apps/api needs
# the root lockfile + packages/types to resolve):
#   docker build -f apps/api/Dockerfile -t smartcampusmaua/api:latest .

FROM node:22-alpine AS base
RUN npm install -g pnpm@11.9.0 turbo@2.5.3

# --- Prune the monorepo down to what @smartcampus/api actually needs ---
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @smartcampus/api --docker

# --- Install production deps (pnpm-lock.yaml is the source of truth) ---
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --prod --frozen-lockfile

# --- Runtime: Bun runs the TypeScript source directly, no bundling step ---
# (bundling would need to externalize native deps like `sharp` anyway, so
# running source under Bun avoids that complexity entirely)
FROM oven/bun:1-alpine AS runner
WORKDIR /app

COPY --from=pruner /app/out/full/ .
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/node_modules ./apps/api/node_modules

USER bun

WORKDIR /app/apps/api
EXPOSE 3300
ENV API_PORT=3300
CMD ["bun", "run", "src/index.ts"]
