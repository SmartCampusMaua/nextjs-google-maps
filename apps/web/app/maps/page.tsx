import Link from "next/link";
import { SensorMap } from "@/components/maps/SensorMap";
import { fetchEnergySensors, fetchRestaurants, fetchWaterSensors } from "@/lib/api";
import type { SensorData } from "@smartcampus/types";

export default async function MapsPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  let energySensors: SensorData[] = [];
  let waterSensors: SensorData[] = [];
  let restaurantSensors: SensorData[] = [];
  let error: string | null = null;

  try {
    const [energyRes, waterRes, restaurantRes] = await Promise.allSettled([
      fetchEnergySensors(),
      fetchWaterSensors(),
      fetchRestaurants()
    ]);

    if (energyRes.status === "fulfilled") {
      energySensors = energyRes.value.data;
    }
    if (waterRes.status === "fulfilled") {
      waterSensors = waterRes.value.data;
    }
    
    if (restaurantRes.status === "fulfilled") {
      restaurantSensors = restaurantRes.value.data;
    }
    
    if (
      energyRes.status === "rejected" &&
        waterRes.status === "rejected" &&
      restaurantRes.status === "rejected"
    ) {
      error = "Could not connect to the sensor API. Showing map without data.";
    }
  } catch {
    error = "Could not connect to the sensor API. Showing map without data.";
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Home
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">
            SmartCampus Sensor Map
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            ⚡ {energySensors.length} energy sensor
            {energySensors.length !== 1 ? "s" : ""}
          </span>
          <span>
            💧 {waterSensors.length} water sensor
            {waterSensors.length !== 1 ? "s" : ""}
          </span>
          <span>
            🍴 {restaurantSensors.length} restaurant sensor
            {restaurantSensors.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800 flex-shrink-0">
          ⚠️ {error}
        </div>
      )}

      {/* Map fills remaining space */}
      <div className="flex-1 relative overflow-hidden">
        {!apiKey ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center p-8 bg-white rounded-xl shadow max-w-md">
              <p className="text-2xl mb-3">🗺️</p>
              <h2 className="text-xl font-semibold mb-2">
                Google Maps API Key Required
              </h2>
              <p className="text-gray-600 text-sm">
                Set{" "}
                <code className="bg-gray-100 px-1 rounded">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </code>{" "}
                in your{" "}
                <code className="bg-gray-100 px-1 rounded">
                  apps/web/.env
                </code>{" "}
                file to display the map.
              </p>
            </div>
          </div>
        ) : (
          <SensorMap
            apiKey={apiKey}
            energySensors={energySensors}
            waterSensors={waterSensors}
            restaurantSensors={restaurantSensors}
          />
        )}
      </div>
    </>
  );
}
