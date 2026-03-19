import { Elysia } from "elysia";
import { energyRoutes, waterRoutes } from "./routes";

const port = Number(process.env.PORT ?? 3001);

const app = new Elysia()
  .get("/", () => ({
    name: "SmartCampusMaua API",
    version: "0.1.0",
    docs: "/swagger",
  }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(energyRoutes)
  .use(waterRoutes)
  .listen(port);

console.log(
  `🦊 SmartCampusMaua API running at http://localhost:${app.server?.port}`
);

export type App = typeof app;
