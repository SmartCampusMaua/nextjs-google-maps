import type { SensorLocation, SensorType } from "@smartcampus/types";

/**
 * Static sensor location registry.
 * In production this would come from a database or configuration service.
 */
export const sensorLocations: SensorLocation[] = [
  {
    id: "restaurant-001",
    name: "Restaurante Bloco V",
    description: "",
    latitude: -23.64819564988993,
    longitude:  -46.57441253916657,
    type: "restaurant",
  },
  {
    id: "restaurant-002",
    name: "Restaurante Bloco N",
    description: "",
    latitude: -23.649511316153184,
    longitude: -46.572751243805925,
    type: "restaurant",
  },
  {
    id: "restaurant-003",
    name: "Restaurante Bloco Ginásio",
    description: "",
    latitude: -23.64707650417544,
    longitude: -46.57305993118999,
    type: "restaurant",
  },
  {
    id: "restaurant-004",
    name: "Restaurante Quiosque",
    description: "",
    latitude: -23.648892753482794,
    longitude:  -46.5728712161721,
    type: "restaurant",
  },
  {
    id: "restaurant-005",
    name: "Restaurante Açaí",
    description: "",
    latitude: -23.648092071563553,
    longitude: -46.574687940662365,
    type: "restaurant",
  }
];

export function getSensorsByType(type: SensorType): SensorLocation[] {
  return sensorLocations.filter((s) => s.type === type);
}

export function getSensorById(id: string): SensorLocation | undefined {
  return sensorLocations.find((s) => s.id === id);
}
