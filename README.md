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

#### SSL

```bash
cd infra/postgresql

export POSTGRES_DB=POSTGRES_DB
export POSTGRES_HOST=POSTGRES_HOST
export POSTGRES_PASSWORD=POSTGRES_PASSWORD
export POSTGRES_PORT=5432
export POSTGRES_USER=POSTGRES_USER

# root.csr root.key
openssl req -new -nodes -text -out root.csr -keyout root.key -subj "/CN=$POSTGRES_USER"
chmod og-rwx root.key

# root.crt
openssl x509 -req -in root.csr -text -days 3650 -extfile /etc/ssl/openssl.cnf -extensions v3_ca -signkey root.key -out root.crt

# server.csr server.key
openssl req -new -nodes -text -out server.csr -keyout server.key -subj "/CN=$POSTGRES_HOST"
sudo chown 0:70 server.key
sudo chmod 640 server.key

# server.crt root.srl
openssl x509 -req -in server.csr -text -days 365 -CA root.crt -CAkey root.key -CAcreateserial -out server.crt

# client.csr client.key
openssl req -new -nodes -text -out client.csr -keyout client.key -subj "/CN=client"
sudo chown 0:70 client.key
sudo chmod 640 client.key

# client.crt
openssl x509 -req -in client.csr -text -days 365 -CA root.crt -CAkey root.key -CAcreateserial -out client.crt

cp root.crt server.crt server.key pg_hba.conf $POSTGRES_SERVER
cp root.crt client.crt client.key $POSTGRES_CLIENT
```

#### PostgreSQL Server

```bash
cd infra
docker compose up -d --build --force-recreate
```

#### PostgreSQL Client

```bash
cd $POSTGRES_CLIENT
psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB?sslmode=verify-full&sslrootcert=./root.crt&sslcert=./client.crt&sslkey=./client.key"
```

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
