import type { SensorLocation, SensorType } from "@smartcampus/types";

/**
 * Static sensor location registry.
 * In production this would come from a database or configuration service.
 */
export const sensorLocations: SensorLocation[] = [
  {
    id: "019b08df-26e7-7506-a5f6-916b2bef24f4",
    name: "Restaurante Bloco V",
    description: "",
    latitude: -23.64819564988993,
    longitude:  -46.57441253916657,
    type: "restaurant",
  },
  {
    id: "019b08df-26e7-71b5-8df6-56c2e954ac91",
    name: "Restaurante Bloco N",
    description: "",
    latitude: -23.649511316153184,
    longitude: -46.572751243805925,
    type: "restaurant",
  },
  {
    id: "019b08df-26e7-7119-97da-523f9236db80",
    name: "Restaurante Bloco Ginásio",
    description: "",
    latitude: -23.64707650417544,
    longitude: -46.57305993118999,
    type: "restaurant",
  },
  {
    id: "019b08df-26e7-7f7b-a18f-b3d6c3fdf248",
    name: "Restaurante Quiosque",
    description: "",
    latitude: -23.648892753482794,
    longitude:  -46.5728712161721,
    type: "restaurant",
  },
  {
    id: "019b08df-26e7-7866-a0fb-1768122b8584",
    name: "Restaurante Açaí",
    description: "",
    latitude: -23.648092071563553,
    longitude: -46.574687940662365,
    type: "restaurant",
  },
  { 
    id: "water-001",
    name: "Caixa d'água Bombeiros",
    latitude: -23.64783508471281, 
    longitude : -46.57322304699091,
    type: "water"
  },
  {
    id: "water-002",
    name: "Caixa d'água Consumo",
    latitude: -23.64783508471281, 
    longitude : -46.57322304699091,
    type: "water"
  },
  {
    id: "water-003",
    name: "Caixa d'água Reserva",
    latitude: -23.64783508471281, 
    longitude : -46.57322304699091,
    type: "water"
  },
  {
    id: "water-004",
    name: "Caixa d'água Cisterna",
    latitude: -23.64783508471281, 
    longitude : -46.57322304699091,
    type: "water"
  },
  {
    id: "water-005",
    name: "Caixa d'água Bloco H",
    latitude: -23.648500924327955,
    longitude : -46.57451318944901,
    type: "water"
  },
  { 
    id: "water-006",
    name: "Caixa d'água Bloco J",
    latitude: -23.646754009486493,
    longitude : -46.573442988091635,
    type: "water"
  },
  {
    id: "water-007",
    name: "Caixa d'água Banco S",
    latitude: -23.649573637073875, 
    longitude : -46.57436639498939,
    type: "water"
  },
];

export function getSensorsByType(type: SensorType): SensorLocation[] {
  return sensorLocations.filter((s) => s.type === type);
}

export function getSensorById(id: string): SensorLocation | undefined {
  return sensorLocations.find((s) => s.id === id);
}
