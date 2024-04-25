FROM node:20-alpine AS base

FROM base as installer
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install
RUN npm install -g @nestjs/cli

FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=installer /app/node_modules ./node_modules
COPY . .
CMD ["sh", "-c", "pnpm run migrations:run && pnpm nest start"]