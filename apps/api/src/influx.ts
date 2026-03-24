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

export async function querySensors(measurement: SensorType, limit = 100, device_id : string) {
  const influx = getInfluxClient();
  let query;
  if(measurement == "energy" || measurement == "restaurant"){
    query = `
    SELECT *
    FROM kron_ks3000
    WHERE time >= now() - interval '2 days'
    AND device_id = '${device_id}'
    ORDER BY time DESC
  `;
  }
  else{
    query = `
    SELECT *
    FROM milesight_em500_swl
    WHERE time >= now() - interval '2 days'
    AND device_id = '${device_id}'
    ORDER BY time DESC    
`;
  }
  
  const rows: Record<string, unknown>[] = [];
  const result = await influx.query(query, database);
  for await (const row of result) {
    rows.push(row);
  }
  return rows;
}

export async function queryLatestSensorReadings(measurement: string, device_id : string) {
  const influx = getInfluxClient();
  let query;
  if(measurement == "energy" || measurement == "restaurant"){
    query = `
    SELECT DISTINCT ON (device_id) *
    FROM kron_ks3000
    WHERE time >= now() - interval '2 days'
    AND device_id = '${device_id}'
    ORDER BY device_id, time DESC
  `;
  }
  else if(measurement == "water_tank"){
    query = `
    SELECT DISTINCT ON (device_id) *
    FROM milesight_em500_swl
    WHERE time >= now() - interval '2 days'
    AND device_id = '${device_id}'
    ORDER BY device_id, time DESC
  `;
  }
  else{
    query = `
    SELECT DISTINCT ON (device_id) *
    FROM milesight_em300_di
    WHERE time >= now() - interval '2 days'
    AND device_id = '${device_id}'
    ORDER BY device_id, time DESC
  `;
  }


  const rows: Record<string, unknown>[] = [];
  const result = await influx.query(query, database);
  for await (const row of result) {
    rows.push(row);
  }
  console.log(rows);
  return rows;
}
