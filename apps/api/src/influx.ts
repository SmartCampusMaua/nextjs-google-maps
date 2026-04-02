import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";
import { EnergyReading, SensorType } from "@smartcampus/types";

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

export async function queryRestaurantsPayment(device_id : string, date : Date){
  const influx = getInfluxClient();
  let query = `
  (SELECT a_plus, time, 1 as query_order
  FROM kron_ks3000
  WHERE device_id = '${device_id}'
  AND time >= make_date(${date.getFullYear()},${date.getMonth() + 1}, 1)::TIMESTAMP + interval '3h' - interval '1 day'
  AND time < make_date(${date.getFullYear()},${date.getMonth() + 1}, 1)::TIMESTAMP + interval '3h'
  ORDER BY time DESC
  LIMIT 1
  )
  UNION ALL(
  SELECT a_plus, time, 2 as query_order
  FROM kron_ks3000
  WHERE device_id = '${device_id}'
  AND time <= now()
  AND time >= now() - interval '2 days'
  ORDER BY time DESC   
  LIMIT 1
  ) UNION ALL (
  SELECT a_plus, time, 3 as query_order
  FROM kron_ks3000
  WHERE device_id = '${device_id}'
  AND time >= make_date(${date.getFullYear()},${date.getMonth() + 1}, 1) + interval '3h' + interval '1 month' - interval '1 day'
  AND time < make_date(${date.getFullYear()},${date.getMonth() + 1}, 1) + interval '3h' + interval '1 month'
  ORDER BY time DESC   
  LIMIT 1
  )
  ORDER BY query_order
  `;
  
  const rows: Record<string, number>[] = [];
  const result = await influx.query(query, database);
  for await (const row of result) {
    rows.push(row);
  }
  if(rows.length == 3){
    return [rows[0], rows[2]]
  }
  return [rows[0], rows[1]]
}

export async function queryRestaurantsConsumptionFromMonth(device_id : string, date : Date){
  const influx = getInfluxClient();

  let query = `(
  SELECT max(a_plus) - min(a_plus) as a_plus, '01' as day
  FROM kron_ks3000
  WHERE time >= make_date(${date.getFullYear()},${date.getMonth() + 1}, 1)::TIMESTAMP + interval '3h'
  AND time <= make_date(${date.getFullYear()},${date.getMonth() + 1}, 1)::TIMESTAMP + interval '3h' + interval '1 day'
  AND device_id = '${device_id}'
  GROUP BY device_id
  )
`;
  let days = [];
  for(let day = 2; day <= new Date(date.getFullYear(),date.getMonth() + 1, 0).getDate(); day++){
    days.push(day)
  }
  for(let day in days){
    query += ` UNION ALL
    (
    SELECT max(a_plus) - min(a_plus) as a_plus, '${String(Number(day) + 2).padStart(2, '0')}' as day
    FROM kron_ks3000
    WHERE time >= make_date(${date.getFullYear()},${date.getMonth() + 1}, ${Number(day) + 2})::TIMESTAMP + interval '3h'
    AND time <= make_date(${date.getFullYear()},${date.getMonth() + 1}, ${Number(day) + 2})::TIMESTAMP + interval '3h' + interval '1 day'
    AND device_id = '${device_id}'
    GROUP BY device_id
    )
`
  }
  query += `
  ORDER BY day
`;
  const rows: Record<string, {a_plus: number, day : string}>[] = [];
  const result = await influx.query(query, database);
  for await (const row of result) {
    rows.push(row);
  }
  return rows;

}
