  # Deploy — SmartCampus / CIPA (intranet)

Guia para colocar o sistema no ar num PC/servidor da intranet do Instituto.
Três peças rodam juntas:

| Peça | Porta | O que é |
|------|-------|---------|
| **web** (Next.js) | 3000 | O site: `/cipa`, painéis de TV, relatórios |
| **api** (Bun + ElysiaJS) | 3001 | Endpoints `/cipa/...` e sensores |
| **PostgreSQL** | 5432 | Banco de dados (nativo ou Docker) |

## 1. Requisitos na máquina de deploy

- **Bun** — `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL** — duas opções (mesmas credenciais nas duas):
  - *Nativo:* `sudo apt install postgresql` + criar role/db `smartcampus`
    (senha `smartcampus`) — ver comandos no fim deste arquivo;
  - *Docker:* `docker compose up -d` usando o `docker-compose.yml` da raiz.

## 2. Instalar dependências

```bash
bun install        # na RAIZ do repositório (workspace resolve web+api+types)
```

## 3. Configurar

**`apps/api/.env`** (copie de `.env.example`):

```
DATABASE_URL=postgres://smartcampus:smartcampus@localhost:5432/smartcampus
# CRUZ_INICIO=2026-01-01   # opcional: início da contagem de dias
```

**⚠️ O ponto que mais derruba deploy — `NEXT_PUBLIC_API_URL`:**
as páginas chamam a API **a partir do navegador de quem acessa** (TVs, outros
PCs). `localhost:3001` só funciona no próprio servidor. Antes do build do site,
defina o IP real do servidor:

```bash
# apps/web/.env.production  (crie este arquivo)
NEXT_PUBLIC_API_URL=http://IP_DO_SERVIDOR:3001
```

(Esse valor é "gravado" no site **na hora do build** — mudou o IP, refaça o build.)

## 4. Build de produção

```bash
cd apps/api && bun run build     # gera dist/index.js
cd ../web  && bun run build      # gera .next/ otimizado
```

## 5. Rodar

```bash
# API (terminal 1)
cd apps/api && bun run start     # roda dist/index.js na :3001

# Site (terminal 2)
cd apps/web && bun run start     # next start na :3000
```

Teste: `http://IP_DO_SERVIDOR:3000/cipa`

**URLs para as TVs** (tela cheia, atualizam sozinhas a cada 60 s):

- `http://IP_DO_SERVIDOR:3000/painel/trabalho`
- `http://IP_DO_SERVIDOR:3000/painel/publico`
- Meses anteriores: acrescente `?ano=2026&mes=5`

## 6. Iniciar junto com a máquina (systemd)

Crie `/etc/systemd/system/cipa-api.service`:

```ini
[Unit]
Description=SmartCampus API (CIPA)
After=network.target postgresql.service

[Service]
User=SEU_USUARIO
WorkingDirectory=/caminho/para/nextjs-google-maps/apps/api
ExecStart=/home/SEU_USUARIO/.bun/bin/bun run start
Restart=always

[Install]
WantedBy=multi-user.target
```

E `/etc/systemd/system/cipa-web.service` (igual, trocando `Description`,
`WorkingDirectory` para `apps/web` e `After=network.target cipa-api.service`).

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now cipa-api cipa-web
```

## 7. Firewall / acesso na intranet

Libere as portas 3000 (site) e, se as TVs acessarem direto, 3001 (API):
`sudo ufw allow 3000/tcp && sudo ufw allow 3001/tcp` (se o ufw estiver ativo).

## 8. Backup do banco

```bash
pg_dump -h localhost -U smartcampus smartcampus > backup_cipa_$(date +%F).sql
# restaurar: psql -h localhost -U smartcampus smartcampus < backup_cipa_AAAA-MM-DD.sql
```

O mesmo `pg_dump`/`psql` serve para **migrar** do PostgreSQL nativo para o
Docker (dump no nativo → desligar nativo → `docker compose up -d` → restore).

---

### Apêndice: criar o banco no PostgreSQL nativo

```bash
sudo apt install -y postgresql
sudo systemctl enable --now postgresql
sudo -u postgres psql -c "CREATE ROLE smartcampus LOGIN PASSWORD 'smartcampus';"
sudo -u postgres psql -c "CREATE DATABASE smartcampus OWNER smartcampus;"
```

As tabelas são criadas **automaticamente** pela API na primeira execução
(`CREATE TABLE IF NOT EXISTS` em `apps/api/src/cipa_db.ts`).
