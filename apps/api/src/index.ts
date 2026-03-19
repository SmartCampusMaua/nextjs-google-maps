import { Elysia } from "elysia";
import { energyRoutes, restaurantRoutes, waterRoutes } from "./routes";
import {openapi} from "@elysiajs/openapi"

const port = Number(process.env.PORT ?? 3001);

const app = new Elysia()
  .use(openapi())
  .get("/", () => ({
    name: "SmartCampusMaua API",
    version: "0.1.0",
    docs: "/swagger",
  }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(energyRoutes)
  .use(waterRoutes)
  .use(restaurantRoutes)
  .listen(port);

console.log(
  `🦊 SmartCampusMaua API running at http://localhost:${app.server?.port}`
);

export type App = typeof app;
