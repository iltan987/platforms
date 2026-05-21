# Node version: update ARG when bumping LTS.
ARG NODE_VERSION=24.15.0-alpine

# ============================================
# Stage 0: shared base
# ============================================
FROM node:${NODE_VERSION} AS base
RUN corepack enable
WORKDIR /app

# ============================================
# Stage 1: install dependencies
# ============================================
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# ============================================
# Stage 2: build Next.js (standalone output)
# ============================================
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=cache,target=/app/.next/cache \
  pnpm build

# ============================================
# Stage 3: runtime
# ============================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir .next && chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
