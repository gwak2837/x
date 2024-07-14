## Requirements (Recommanded)

- macOS 13.6
- Docker 20.10
- Bun 1.1
- Node.js 20.15
- PostgreSQL 16.3
- OpenSSL 3.3

## Getting Started

```bash
bun i
```

### infra

#### local machine

```bash
docker run \
  -d \
  -e POSTGRES_USER=POSTGRES_USER \
  -e POSTGRES_PASSWORD=POSTGRES_PASSWORD \
  -e POSTGRES_DB=POSTGRES_DB \
  -e LANG=ko_KR.UTF8 \
  -e LC_COLLATE=C \
  -e POSTGRES_INITDB_ARGS=--data-checksums \
  --name postgres \
  -p 5432:5432 \
  --restart=on-failure \
  --shm-size=256MB \
  postgres:16-alpine
```

#### cloud instance

```bash
cd infra/postgresql

export POSTGRES_HOST=localhost
export POSTGRES_USER=postgres_user

# root.csr root.key
openssl req -new -nodes -text -out root.csr -keyout root.key -subj "/CN=$POSTGRES_USER"
chmod og-rwx root.key

# root.crt
openssl x509 -req -in root.csr -text -days 3650 -extfile ./openssl.conf -extensions v3_ca -signkey root.key -out root.crt

# server.csr server.key
openssl req -new -nodes -text -out server.csr -keyout server.key -subj "/CN=$POSTGRES_HOST"
chown 0:70 server.key
chmod 640 server.key

# server.crt root.srl
openssl x509 -req -in server.csr -text -days 365 -CA root.crt -CAkey root.key -CAcreateserial -out server.crt

# client.csr client.key
openssl req -new -nodes -text -out client.csr -keyout client.key -subj "/CN=client"
chown 0:70 client.key
chmod 640 client.key

# client.crt
openssl x509 -req -in client.csr -text -days 365 -CA root.crt -CAkey root.key -CAcreateserial -out client.crt

sudo cp root.crt client.crt client.key ../../backend
```

```bash
cd infra
docker compose up -d --build --force-recreate
```

#### cloud SaaS

- Cloud SQL
- RDS

### backend

```bash
cd backend
cp .env.template .env.development.local
bun dev
```

### frontend

```bash
cd frontend
cp .env.template .env.development.local
npm run dev
```
