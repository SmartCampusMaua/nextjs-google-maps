import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relatórios | SmartCampus Mauá",
  description: "Gerar relatórios",
};

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col h-screen">{children}</div>;
}
