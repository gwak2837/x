# Build time
FROM oven/bun:1 as builder

ENV NODE_ENV production
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --silent --frozen-lockfile

COPY src src
COPY tsconfig.json ./
RUN bun run compile

# Run time
FROM gcr.io/distroless/base-nossl-debian12:nonroot

ENV NODE_ENV production
WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/app.bun ./

EXPOSE $PORT
ENTRYPOINT [ "./app.bun" ]
