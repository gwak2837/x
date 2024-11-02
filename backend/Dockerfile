# Build time
FROM oven/bun:1 as builder

ENV NODE_ENV production
WORKDIR /app

COPY package.json bun.lockb ./
COPY backend/package.json backend/package.json
COPY batch/package.json batch/package.json
COPY frontend/package.json frontend/package.json

# `--production` : 빌드 시간 빨라짐 10s -> 2s
RUN bun install --frozen-lockfile --production --silent

COPY backend/src backend/src
COPY backend/tsconfig.json backend/tsconfig.json
RUN cd backend && bun run compile

# Run time
FROM gcr.io/distroless/base-nossl-debian12:nonroot

ENV NODE_ENV production
WORKDIR /app

COPY --chown=nonroot:nonroot --from=builder /app/backend/app.bun ./

EXPOSE $PORT
ENTRYPOINT [ "./app.bun" ]
