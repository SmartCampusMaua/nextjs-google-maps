"use client";

import type { MapLayer } from "@smartcampus/types";

interface LayerControlProps {
  layers: MapLayer[];
  onToggle: (layerId: string) => void;
}

export function LayerControl({ layers, onToggle }: LayerControlProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-lg p-4 min-w-[180px]">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Layers
      </h3>
      <ul className="space-y-2">
        {layers.map((layer) => (
          <li key={layer.id}>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => onToggle(layer.id)}
                className="w-4 h-4 rounded"
                style={{ accentColor: layer.color }}
              />
              <span
                className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-sm text-gray-800">{layer.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
