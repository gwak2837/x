# Build time
FROM oven/bun:1 as builder

WORKDIR /app
ENV NODE_ENV production

COPY package.json .
COPY bun.lockb .
RUN bun install --production --silent --frozen-lockfile

COPY src src
COPY tsconfig.json .
RUN bun run compile

# Run time
FROM gcr.io/distroless/base-nossl-debian12:nonroot as runner

WORKDIR /app

COPY --from=builder --chown=nonroot:nonroot /app/app.bun .

EXPOSE 4000
ENTRYPOINT [ "./app.bun" ]
