import { Elysia } from "elysia";
import { energyRoutes, reportsRoutes, restaurantRoutes, waterRoutes } from "./routes";
import {openapi} from "@elysiajs/openapi";
import {cors} from "@elysiajs/cors";

const port = Number(process.env.PORT ?? 3001);

const app = new Elysia()
  .use(cors())
  .use(openapi())
  .get("/", () => ({
    name: "SmartCampusMaua API",
    version: "0.1.0",
    docs: "/openapi",
  }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(energyRoutes)
  .use(waterRoutes)
  .use(restaurantRoutes)
  .use(reportsRoutes)
  .listen(port);

console.log(
  `🦊 SmartCampusMaua API running at http://localhost:${app.server?.port}`
);

export type App = typeof app;
