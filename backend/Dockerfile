# Build time
FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --silent --frozen-lockfile

COPY prisma prisma
RUN bun run prisma generate

COPY src src
COPY tsconfig.json ./
RUN bun run compile

# Run time
FROM gcr.io/distroless/base-nossl-debian12:nonroot

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/app.bun .

EXPOSE 4000
ENTRYPOINT [ "./app.bun" ]
