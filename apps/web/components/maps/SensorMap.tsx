"use client";

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import type { SensorData, MapLayer } from "@smartcampus/types";
import { LayerControl } from "./LayerControl";
import { SensorInfoWindow } from "./SensorInfoWindow";

interface SensorMapProps {
  energySensors: SensorData[];
  waterSensors: SensorData[];
  restaurantSensors : SensorData[];
  apiKey: string;
}

const CAMPUS_CENTER = { lat: -23.6491, lng: -46.5754 };

const DEFAULT_LAYERS: MapLayer[] = [
  {
    id: "energy",
    name: "Energy Sensors",
    type: "energy",
    visible: true,
    color: "#F59E0B",
  },
  {
    id: "water",
    name: "Water Sensors",
    type: "water",
    visible: true,
    color: "#3B82F6",
  },
  {
    id: "restaurant",
    name: "Restaurant Sensors",
    type: "restaurant",
    visible: true,
    color: "#88e788",
  }
];

export function SensorMap({
  energySensors,
  waterSensors,
  restaurantSensors,
  apiKey,
}: SensorMapProps) {
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS);
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(
    null
  );
  
  const toggleLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const energyVisible = layers.find((l) => l.id === "energy")?.visible ?? true;
  const waterVisible = layers.find((l) => l.id === "water")?.visible ?? true;
  const restaurantVisible = layers.find((l) => l.id === "restaurant")?.visible ?? true;

  const sensors = energySensors.concat(waterSensors, restaurantSensors);
  
  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        <LayerControl layers={layers} onToggle={toggleLayer} />

        <Map
          mapId="smartcampus-map"
          defaultCenter={CAMPUS_CENTER}
          defaultZoom={16}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Energy sensor markers */}
          {energyVisible &&
            energySensors.map((data) => (
              <AdvancedMarker
                key={data.sensor.id}
                position={{
                  lat: data.sensor.latitude,
                  lng: data.sensor.longitude,
                }}
                onClick={() => setSelectedSensor(data)}
                title={data.sensor.name}
              >
                <Pin
                  background="#F59E0B"
                  borderColor="#D97706"
                  glyphColor="#ffffff"
                  glyph="⚡"
                  scale={1.2}
                />
              </AdvancedMarker>
            ))}

          {/* Water sensor markers */}
          {waterVisible &&
            waterSensors.map((data) => (
              <AdvancedMarker
                key={data.sensor.id}
                position={{
                  lat: data.sensor.latitude,
                  lng: data.sensor.longitude,
                }}
                onClick={() => setSelectedSensor(data)}
                title={data.sensor.name}
              >
                <Pin
                  background="#3B82F6"
                  borderColor="#2563EB"
                  glyphColor="#ffffff"
                  glyph="💧"
                  scale={1.2}
                />
              </AdvancedMarker>
            ))}

          {/* Restaurant sensor markers */}
          {restaurantVisible &&
            restaurantSensors.map((data) => (
              <AdvancedMarker
                key={data.sensor.id}
                position={{
                  lat: data.sensor.latitude,
                  lng: data.sensor.longitude,
                }}
                onClick={() => setSelectedSensor(data)}
                title={data.sensor.name}
              >
                <Pin
                  background="#88e788"
                  borderColor="#2563EB"
                  glyphColor="#88e788"
                  glyph="🍴"
                  scale={1.2}
                />
              </AdvancedMarker>
            ))}

          {/* Info window for selected sensor */}
          {selectedSensor && (
            <InfoWindow
              position={{
                lat: selectedSensor.sensor.latitude,
                lng: selectedSensor.sensor.longitude,
              }}
              onCloseClick={() => setSelectedSensor(null)}
              headerDisabled
            >
              <SensorInfoWindow
                pressedSensor={selectedSensor}
                onClose={() => setSelectedSensor(null)}
                sensors={sensors}
              />
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
