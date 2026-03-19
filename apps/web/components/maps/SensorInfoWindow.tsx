"use client";

import type { SensorData } from "@smartcampus/types";

interface SensorInfoWindowProps {
  sensor: SensorData;
  onClose: () => void;
}

export function SensorInfoWindow({ sensor, onClose }: SensorInfoWindowProps) {
  const { sensor: location, latestReading } = sensor;
  const isEnergy = location.type === "energy";

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 min-w-[220px] max-w-[280px]">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">{isEnergy ? "⚡" : "💧"}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1">
        {location.name}
      </h4>
      {location.description && (
        <p className="text-xs text-gray-500 mb-2">{location.description}</p>
      )}
      {location.building && (
        <p className="text-xs text-gray-600">
          <span className="font-medium">Building:</span> {location.building}
          {location.floor ? ` — ${location.floor}` : ""}
        </p>
      )}
      <div className="mt-3 pt-3 border-t border-gray-100">
        {latestReading ? (
          <div>
            <p className="text-xs text-gray-500 mb-1">Latest Reading</p>
            <p className="text-lg font-bold text-gray-900">
              {latestReading.value.toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-500">
                {latestReading.unit}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(latestReading.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No readings available</p>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">ID: {location.id}</p>
    </div>
  );
}
