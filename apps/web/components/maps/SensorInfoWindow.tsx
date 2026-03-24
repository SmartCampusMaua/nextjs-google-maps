"use client";

import { getSensorReadings } from "@/lib/api";
import type { SensorData, SensorReading, SensorReadings, SensorType } from "@smartcampus/types";
import { useEffect, useState } from "react";

import { ChartContainer, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Label, Legend, Line, LineChart, XAxis, YAxis } from "recharts"

type DataType = {
  value : number,
  timestamp : number
}

let chartConfig = {
  energy: {
    label : "Consumo energia (kWh)",
    color : "#2563eb"
  },
  restaurant: {
    label: "Consumo energia (kWh)",
    color: "#60a5fa"
  },
  water : {
    label: "Altura da água (m)",
    color: "#60a5fa"
  }
} satisfies ChartConfig

interface SensorInfoWindowProps {
    pressedSensor: SensorData;
    onClose: () => void;
    sensors: SensorData[];
}

const iconTypes = {
    "energy": "⚡",
    "water": "💧",
    "restaurant": "🍴"
};

export function SensorInfoWindow({ pressedSensor, onClose, sensors }: SensorInfoWindowProps) {
  const sensorsInSameLocation = sensors.filter((otherSensor) => {
    return otherSensor.sensor.latitude == pressedSensor.sensor.latitude && otherSensor.sensor.longitude == pressedSensor.sensor.longitude;
  });
  let [latestReadings, setLatestReadings] = useState<SensorReadings[]| null>(null);
  
  useEffect(() => {
    let data : SensorReadings[] = [];
    async function fetchReadings(){
      for(let sensor of sensorsInSameLocation){
        const { sensor: location } = sensor;
        let temp = await getSensorReadings(location.id, location.type, 10);
        data.push(temp);
      };
      setLatestReadings(data);
    }
    fetchReadings();
  },[pressedSensor]);
    return (
        <div className="bg-white rounded-xl shadow-xl p-4 min-w-[220px] max-w-60%">
            {sensorsInSameLocation.map(
              (sensor, index) => {
                const { sensor: location } = sensor;
                const readings = latestReadings?.at(index)?.readings;
                const sensorReadings = readings?.filter((e) => e.sensorId == location.id);
                let latestReading = sensorReadings?.at(-1);
                const values = sensorReadings?.map((e) => e.value)!.reverse()!
                const timestamps = sensorReadings?.map((e) => e.timestamp)!.reverse()!
                const chartData : DataType[] = values?.map(
                  ((value, i) => ({
                    value: value,
                    timestamp : timestamps[i]
                  }))
                );
                return (
                      <div key={index}>
                            <div className="flex items-start justify-between mb-2 mt-2">
                                <span className="text-xl">{iconTypes[location.type]}</span>
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
                                        {new Date(latestReading.timestamp).toString()}
                                      </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No readings available</p>
                                )}
                              <ChartContainer config={
                                {
                                  value : {
                                    label : chartConfig[location.type]["label"],
                                    color : chartConfig[location.type]["color"],
                                  }
                                }
                              } className="full min-h-max">
                                <AreaChart data={chartData}>
                                  <CartesianGrid vertical={false} />
                                  <XAxis
                                    dataKey="timestamp"
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                      const date = new Date(value)
                                      return date.toLocaleDateString("pt-BR", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })
                                    }}
                                  />
                                  <YAxis width="auto" height="auto" niceTicks="snap125" unit={latestReading?.unit}>
                                    <Label/>
                                  </YAxis>
                                  <Area
                                    type="monotone"
                                    dataKey="value"/>
                                  <ChartLegend content={<ChartLegendContent/>} />
                                </AreaChart>
                              </ChartContainer>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">ID: {location.id}</p>
                        </div>
                    )
                }
            )}
        </div>
    );
}
