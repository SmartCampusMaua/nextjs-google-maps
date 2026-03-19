import { Elysia, t } from "elysia";
import type { SensorData, SensorsResponse } from "@smartcampus/types";
import { querySensors, queryLatestSensorReadings } from "./influx";
import { sensorLocations, getSensorsByType, getSensorById } from "./sensors";

const energyRoutes = new Elysia({ prefix: "/energy" })
    .get(
        "/sensors",
        async () => {
            const sensors = getSensorsByType("energy");
            let rows: Record<string, unknown>[] = [];

            try {
                rows = await queryLatestSensorReadings("energy");
            } catch {
                // Return sensor locations even if InfluxDB is unavailable
            }

            const data: SensorData[] = sensors.map((sensor) => {
                const reading = rows.find(
                    (r) => String(r["sensor_id"]) === sensor.id
                );
                return {
                    sensor,
                    latestReading: reading
                        ? {
                            sensorId: sensor.id,
                            timestamp: String(reading["time"]),
                            value: Number(reading["value"]),
                            unit: String(reading["unit"] ?? "kWh"),
                            type: "energy",
                        }
                        : undefined,
                };
            });

            const response: SensorsResponse = {
                data,
                type: "energy",
                timestamp: new Date().toISOString(),
            };
            return response;
        },
        {
            detail: {
                summary: "List all energy sensors with latest readings",
                tags: ["energy"],
            },
        }
    )
    .get(
        "/sensors/:id/readings",
        async ({ params, query }) => {
            const sensor = getSensorById(params.id);
            if (!sensor || sensor.type !== "energy") {
                return new Response(JSON.stringify({ error: "Sensor not found" }), {
                    status: 404,
                });
            }

            const limit = Number(query.limit ?? 100);
            let readings: Record<string, unknown>[] = [];

            try {
                const rows = await querySensors("energy");
                readings = rows.filter(
                    (r) => String(r["sensor_id"]) === params.id
                );
            } catch {
                // Return empty readings if InfluxDB is unavailable
            }

            return {
                sensor,
                readings: readings.map((r) => ({
                    sensorId: params.id,
                    timestamp: String(r["time"]),
                    value: Number(r["value"]),
                    unit: String(r["unit"] ?? "kWh"),
                    type: "energy" as const,
                })),
            };
        },
        {
            params: t.Object({ id: t.String() }),
            query: t.Object({ limit: t.Optional(t.Number()) }),
            detail: {
                summary: "Get historical readings for an energy sensor",
                tags: ["energy"],
            },
        }
    );

const waterRoutes = new Elysia({ prefix: "/water" })
    .get(
        "/sensors",
        async () => {
            const sensors = getSensorsByType("water");
            let rows: Record<string, unknown>[] = [];

            try {
                rows = await queryLatestSensorReadings("water");
            } catch {
                // Return sensor locations even if InfluxDB is unavailable
            }

            const data: SensorData[] = sensors.map((sensor) => {
                const reading = rows.find(
                    (r) => String(r["sensor_id"]) === sensor.id
                );
                return {
                    sensor,
                    latestReading: reading
                        ? {
                            sensorId: sensor.id,
                            timestamp: String(reading["time"]),
                            value: Number(reading["value"]),
                            unit: String(reading["unit"] ?? "L"),
                            type: "water",
                        }
                        : undefined,
                };
            });

            const response: SensorsResponse = {
                data,
                type: "water",
                timestamp: new Date().toISOString(),
            };
            return response;
        },
        {
            detail: {
                summary: "List all water sensors with latest readings",
                tags: ["water"],
            },
        }
    )
    .get(
        "/sensors/:id/readings",
        async ({ params, query }) => {
            const sensor = getSensorById(params.id);
            if (!sensor || sensor.type !== "water") {
                return new Response(JSON.stringify({ error: "Sensor not found" }), {
                    status: 404,
                });
            }

            let readings: Record<string, unknown>[] = [];

            try {
                const rows = await querySensors("water");
                readings = rows.filter(
                    (r) => String(r["sensor_id"]) === params.id
                );
            } catch {
                // Return empty readings if InfluxDB is unavailable
            }

            return {
                sensor,
                readings: readings.map((r) => ({
                    sensorId: params.id,
                    timestamp: String(r["time"]),
                    value: Number(r["value"]),
                    unit: String(r["unit"] ?? "L"),
                    type: "water" as const,
                })),
            };
        },
        {
            params: t.Object({ id: t.String() }),
            query: t.Object({ limit: t.Optional(t.Number()) }),
            detail: {
                summary: "Get historical readings for a water sensor",
                tags: ["water"],
            },
        }
    );

const restaurantRoutes = new Elysia({ prefix: "/restaurant" })
    .get(
        "/sensors",
        async () => {
            const sensors = getSensorsByType("restaurant");
            let rows: Record<string, unknown>[] = [];

            try {
                rows = await queryLatestSensorReadings("restaurant");
            } catch {
                // Return sensor locations even if InfluxDB is unavailable
            }

            const data: SensorData[] = sensors.map((sensor) => {
                const reading = rows.find(
                    (r) => String(r["sensor_id"]) === sensor.id
                );
                return {
                    sensor,
                    latestReading: reading
                        ? {
                            sensorId: sensor.id,
                            timestamp: String(reading["time"]),
                            value: Number(reading["value"]),
                            unit: String(reading["unit"] ?? ""),
                            type: "restaurant",
                        }
                        : undefined,
                };
            }
            );
            const response: SensorsResponse = {
                data,
                type: "restaurant",
                timestamp: new Date().toISOString(),
            };
            return response;
        },
        {
            detail: {
                summary: "List all restaurants with latest readings",
                tags: ["restaurant"],
            },
        }

    )
    .get(
        "/sensors/:id/readings",
        async ({ params, query }) => {
            const sensor = getSensorById(params.id);
            if (!sensor || sensor.type !== "restaurant") {
                return new Response(JSON.stringify({ error: "Sensor not found" }), {
                    status: 404,
                });
            }
            let readings: Record<string, unknown>[] = [];

            try {
                const rows = await querySensors("restaurant");
                readings = rows.filter(
                    (r) => String(r["sensor_id"]) === params.id
                );
            } catch {
                // Return empty readings if InfluxDB is unavailable
            }

            return {
                sensor,
                readings: readings.map((r) => ({
                    sensorId: params.id,
                    timestamp: String(r["time"]),
                    value: Number(r["value"]),
                    unit: String(r["unit"] ?? "L"),
                    type: "restaurant" as const,
                })),
            };
        },
        {
            params: t.Object({ id: t.String() }),
            query: t.Object({ limit: t.Optional(t.Number()) }),
            detail: {
                summary: "Get historical readings for a restaurant",
                tags: ["restaurant"],
            },
        }
    )

export { energyRoutes, waterRoutes, restaurantRoutes };
