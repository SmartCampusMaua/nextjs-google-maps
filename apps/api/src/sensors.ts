import type { SensorLocation, SensorType } from "@smartcampus/types";

/**
 * Static sensor location registry.
 * In production this would come from a database or configuration service.
 */
export const sensorLocations: SensorLocation[] = [
  // Energy sensors
  {
    id: "energy-001",
    name: "Main Building Energy Meter",
    description: "Primary energy meter for the main academic building",
    latitude: -23.6491,
    longitude: -46.5754,
    type: "energy",
    building: "Main Building",
    floor: "Ground Floor",
  },
  {
    id: "energy-002",
    name: "Library Energy Meter",
    description: "Energy consumption for the university library",
    latitude: -23.6497,
    longitude: -46.576,
    type: "energy",
    building: "Library",
    floor: "Ground Floor",
  },
  {
    id: "energy-003",
    name: "Lab Block Energy Meter",
    description: "Energy usage in the laboratory complex",
    latitude: -23.6485,
    longitude: -46.5748,
    type: "energy",
    building: "Laboratory Block",
    floor: "1st Floor",
  },
  // Water sensors
  {
    id: "water-001",
    name: "Main Building Water Flow",
    description: "Water consumption sensor for the main building",
    latitude: -23.6493,
    longitude: -46.5756,
    type: "water",
    building: "Main Building",
    floor: "Ground Floor",
  },
  {
    id: "water-002",
    name: "Sports Complex Water Meter",
    description: "Water usage in sports facilities",
    latitude: -23.6502,
    longitude: -46.5763,
    type: "water",
    building: "Sports Complex",
  },
  {
    id: "water-003",
    name: "Cafeteria Water Flow",
    description: "Water consumption in the main cafeteria",
    latitude: -23.6488,
    longitude: -46.5751,
    type: "water",
    building: "Cafeteria",
    floor: "Ground Floor",
  },
];

export function getSensorsByType(type: SensorType): SensorLocation[] {
  return sensorLocations.filter((s) => s.type === type);
}

export function getSensorById(id: string): SensorLocation | undefined {
  return sensorLocations.find((s) => s.id === id);
}
