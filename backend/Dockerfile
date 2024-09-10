# Build time
FROM oven/bun:1 as builder

ENV NODE_ENV production
WORKDIR /app

COPY package.json bun.lockb ./

# `--production` : 빌드 시간 빨라짐 10s -> 2s
RUN bun install --frozen-lockfile --production --silent

COPY src src
COPY tsconfig.json ./
RUN bun run compile

# Run time
FROM gcr.io/distroless/base-nossl-debian12:nonroot

ENV NODE_ENV production
WORKDIR /app

COPY --chown=nonroot:nonroot --from=builder /app/app.bun ./

EXPOSE $PORT
ENTRYPOINT [ "./app.bun" ]
