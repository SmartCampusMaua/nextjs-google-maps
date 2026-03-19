# SmartCampus Mauá — Next.js + Google Maps

A Turborepo monorepo for real-time IoT sensor monitoring at Campus Mauá, featuring an interactive Google Maps dashboard backed by InfluxDB3.

## Structure

```
/
├── apps/
│   ├── web/          # Next.js 16 (App Router) — frontend with Google Maps at /maps
│   └── api/          # Elysia.js backend — queries InfluxDB3 for sensor data
├── packages/
│   └── types/        # Shared TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
└── .env.example
```

## Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Frontend    | Next.js 16 · App Router · Tailwind  |
| Maps        | `@vis.gl/react-google-maps`         |
| Backend     | Elysia.js (Bun)                     |
| Time-series | InfluxDB3                           |
| Monorepo    | Turborepo · PNPM                    |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- [PNPM](https://pnpm.io) ≥ 9
- [Bun](https://bun.sh) (for the API app)
- A running InfluxDB3 instance
- A Google Maps API key (with Maps JavaScript API enabled)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp .env.example apps/web/.env
cp .env.example apps/api/.env
# Edit both .env files with your credentials

# 3. Start development servers
pnpm dev
```

The web app will be available at **http://localhost:3000** and the API at **http://localhost:3001**.

## Environment Variables

### `apps/web/.env`

| Variable                          | Description                                 |
| --------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key              |
| `NEXT_PUBLIC_API_URL`             | Base URL for the Elysia API (default: 3001) |

### `apps/api/.env`

| Variable           | Description                           |
| ------------------ | ------------------------------------- |
| `INFLUXDB_URL`     | InfluxDB3 host URL                    |
| `INFLUXDB_TOKEN`   | InfluxDB3 auth token                  |
| `INFLUXDB_ORG`     | InfluxDB3 organisation                |
| `INFLUXDB_DATABASE`| InfluxDB3 database / bucket name      |
| `PORT`             | Port for the Elysia API (default: 3001)|

## API Endpoints

| Method | Path                          | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/health`                     | Health check                               |
| GET    | `/energy/sensors`             | All energy sensors with latest readings    |
| GET    | `/energy/sensors/:id/readings`| Historical readings for an energy sensor   |
| GET    | `/water/sensors`              | All water sensors with latest readings     |
| GET    | `/water/sensors/:id/readings` | Historical readings for a water sensor     |

## InfluxDB3 Schema

The API expects two measurements in InfluxDB3:

**`energy`** measurement:
- `sensor_id` (tag) — matches the sensor ID in the registry
- `value` (field) — consumption value
- `unit` (field) — e.g. `kWh`, `W`, `kW`

**`water`** measurement:
- `sensor_id` (tag)
- `value` (field)
- `unit` (field) — e.g. `L`, `m3`, `L/min`
