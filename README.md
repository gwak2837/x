## Requirements (Recommanded)

- macOS 13.6
- Bun 1.1
- Node.js 20.15
- PostgreSQL 16.3
- Docker 25.0

## Getting Started

```bash
bun i
```

### Infra

```bash
cd infra
docker compose up -d --build --force-recreate
```

Start PostgreSQL and Redis server.

### backend

```bash
cd backend
cp .env.template .env.development.local
bun migrate:dev
bun dev
```

Open http://localhost:4000/ with your browser to see the result.

### frontend

```bash
cd frontend
cp .env.template .env.development.local
npm run dev
```

Open http://localhost:3000/ with your browser to see the result.
