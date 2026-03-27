export type SensorType = "energy" | "water" | "restaurant";

export interface SensorLocation {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: SensorType;
  building?: string;
  floor?: string;
  displayColor?: string;
}

export interface SensorReading {
  sensorId: string;
  timestamp: number;
  value: number;
  unit: string;
  type: SensorType;
}

export interface SensorData {
  sensor: SensorLocation;
  latestReading?: SensorReading;
  readings?: SensorReading[];
}

export interface SensorReadings{
  readings: SensorReading[];
}

export interface SensorsResponse {
  data: SensorData[];
  type: SensorType;
  timestamp: string;
}

export interface EnergyReading extends SensorReading {
  type: "energy";
  unit: "kWh" | "W" | "kW";
}

export interface WaterReading extends SensorReading {
  type: "water";
  unit: "L" | "m3" | "L/min";
}


export interface MapLayer {
  id: string;
  name: string;
  type: SensorType;
  visible: boolean;
  color: string;
}
