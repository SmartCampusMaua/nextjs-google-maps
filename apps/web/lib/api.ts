import type { SensorReading, SensorReadings, SensorsResponse, SensorType } from "@smartcampus/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function fetchEnergySensors(): Promise<SensorsResponse> {
  const res = await fetch(`${API_URL}/energy/sensors`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch energy sensors: ${res.statusText}`);
  }
  return res.json() as Promise<SensorsResponse>;
}

export async function fetchWaterSensors(): Promise<SensorsResponse> {
  const res = await fetch(`${API_URL}/water/sensors`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch water sensors: ${res.statusText}`);
  }
  return res.json() as Promise<SensorsResponse>;
}

export async function fetchRestaurants(): Promise<SensorsResponse> {
  const res = await fetch(`${API_URL}/restaurant/sensors`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch restaurants: ${res.statusText}`);
  }
  return res.json() as Promise<SensorsResponse>;
}

export async function getSensorReadings(device_id : string, type : SensorType, limit: number = 1) : Promise<SensorReadings>{
  const query = new URLSearchParams({
    limit : `${limit}`
  }).toString();
  const res = await fetch(`${API_URL}/${type}/sensors/${device_id}/readings?${query}`, );
  if (!res.ok) {
    throw new Error(`Failed to get sensor Readings: ${res.statusText}`);
  }
  return res.json() as Promise<SensorReadings>;
}

export async function getRestaurantReport(device_id : string){
  try {
    const response = await fetch(`${API_URL}/reports/${device_id}`);
    const blob = await response.blob();
    return blob;

  } catch (error) {
    console.error("Failed to get the report PDF:", error);
  }
}
