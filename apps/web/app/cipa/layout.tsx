import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIPA | SmartCampus Mauá",
  description: "Comissão Interna de Prevenção de Acidentes",
};

export default function CipaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      {/* Cabeçalho fixo com a identidade da Segurança do Trabalho, que
          organiza e coleta os dados que abastecem a CIPA. */}
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seguranca-do-trabalho.jpg"
          alt="Segurança do Trabalho — Instituto Mauá de Tecnologia"
          className="h-12 w-auto"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-800">
            CIPA · Instituto Mauá de Tecnologia
          </p>
          <p className="text-xs text-gray-500">
            Dados organizados e coletados pela Segurança do Trabalho
          </p>
        </div>
      </header>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
