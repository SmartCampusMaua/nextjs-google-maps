import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";
import { SensorType } from "@smartcampus/types";

const url = process.env.INFLUXDB_URL ?? "http://localhost:8086";
const token = process.env.INFLUXDB_TOKEN ?? "";
const database = process.env.INFLUXDB_DATABASE ?? "smartcampus";

let client: InfluxDBClient | null = null;


export function getInfluxClient(): InfluxDBClient {
  if (!client) {
    client = new InfluxDBClient({ host: url, token, database });
  }
  return client;
}

export async function querySensors(measurement: SensorType, limit = 100) {
  const influx = getInfluxClient();
  const query = `
    SELECT *
    FROM "${measurement}"
    ORDER BY time DESC
    LIMIT ${limit}
  `;

  const rows: Record<string, unknown>[] = [];
  const result = await influx.query(query, database);
  for await (const row of result) {
    rows.push(row);
  }
  return rows;
}

export async function queryLatestSensorReadings(measurement: string) {
  const influx = getInfluxClient();
  const query = `
    SELECT DISTINCT ON (sensor_id) *
    FROM "${measurement}"
    ORDER BY sensor_id, time DESC
  `;

  const rows: Record<string, unknown>[] = [];
  const result = await influx.query(query, database);
  for await (const row of result) {
    rows.push(row);
  }
  return rows;
}
