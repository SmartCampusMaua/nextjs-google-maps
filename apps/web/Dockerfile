# Production image for @smartcampus/web (Next.js).
#
# Build from the REPO ROOT (this is a pnpm/turbo workspace, so apps/web needs
# the root lockfile + packages/types to resolve):
#   docker build -f apps/web/Dockerfile \
#     --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=... \
#     --build-arg NEXT_PUBLIC_API_URL=http://localhost:3300 \
#     -t smartcampusmaua/web:latest .

FROM node:22-alpine AS base
RUN npm install -g pnpm@11.9.0 turbo@2.5.3

# --- Prune the monorepo down to what @smartcampus/web actually needs ---
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @smartcampus/web --docker

# --- Install deps and build ---
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm turbo build --filter=@smartcampus/web

# --- Lean runtime image (Next.js standalone output) ---
FROM node:22-alpine AS runner
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app

COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
