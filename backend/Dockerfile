# FaydaRent backend - production image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (cached layer)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install

# Prisma client
COPY prisma ./prisma
RUN bunx prisma generate

# Source code
COPY src ./src
COPY scripts ./scripts

ENV NODE_ENV=production
EXPOSE 3001

# The SQLite database lives in /app/db - mount a volume here
VOLUME ["/app/db"]

CMD ["bun", "src/server.ts"]
