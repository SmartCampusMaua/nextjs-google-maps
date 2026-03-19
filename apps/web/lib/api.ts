import type { SensorsResponse } from "@smartcampus/types";

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
