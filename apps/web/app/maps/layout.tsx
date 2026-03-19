import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sensor Map | SmartCampus Mauá",
  description: "Real-time sensor map for energy and water monitoring",
};

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col h-screen">{children}</div>;
}
