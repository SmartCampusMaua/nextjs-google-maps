"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { listarOcorrencias, type Ocorrencia, type Sistema } from "@/lib/cipa";
import { MESES, montarCruz, diasNoMes, corDoDia, type CorDia } from "../../cipa/_shared/cruz";

// Cores vivas das células (para leitura à distância, na TV).
const COR: Record<CorDia, string> = {
  green: "bg-green-600 text-green-100 border-green-800",
  red: "bg-red-600 text-white border-red-800",
  yellow: "bg-yellow-400 text-yellow-900 border-yellow-600",
  blank: "bg-gray-200 text-gray-400 border-gray-300",
};

// Tamanho de cada célula: escala com a tela (vmin), com um teto em pixels.
const CELL = "min(7.4vmin, 74px)";

export function PainelCruz({
  sistema,
  titulo,
  labelRed,
  labelYellow,
}: {
  sistema: Sistema;
  titulo: string;
  labelRed: string;
  labelYellow: string;
}) {
  const inicio = new Date();
  const [ano] = useState(inicio.getFullYear());
  const [mes] = useState(inicio.getMonth() + 1);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [agora, setAgora] = useState<Date>(inicio);

  // Busca as ocorrências do mês na API.
  const carregar = useCallback(async () => {
    try {
      setOcorrencias(await listarOcorrencias(sistema, ano, mes));
    } catch (e) {
      console.error(e);
    }
  }, [sistema, ano, mes]);

  // Carrega ao abrir e recarrega sozinho a cada 60s (a TV fica sempre atual).
  useEffect(() => {
    carregar();
    const t = setInterval(carregar, 60_000);
    return () => clearInterval(t);
  }, [carregar]);

  // Relógio: atualiza a hora a cada 30s.
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const contadores = useMemo(
    () => ({
      red: ocorrencias.filter((o) => o.gravidade === "red").length,
      yellow: ocorrencias.filter((o) => o.gravidade === "yellow").length,
    }),
    [ocorrencias],
  );

  const ocorrenciasDoDia = (dia: number) => ocorrencias.filter((o) => o.dia === dia);
  const celulas = montarCruz(diasNoMes(ano, mes));
  const ehMesAtual = agora.getFullYear() === ano && agora.getMonth() + 1 === mes;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-green-100 p-3">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between rounded-t-lg border-b-4 border-green-950 bg-[#5a7a2a] px-6 py-3 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seguranca-do-trabalho.jpg"
          alt="Segurança do Trabalho — Instituto Mauá"
          className="h-16 w-auto rounded bg-white p-1"
        />
        <div className="text-center">
          <div className="text-4xl font-extrabold tracking-[0.3em]">CRUZ VERDE</div>
          <div className="mt-1 text-lg tracking-widest text-green-100">
            {titulo} · {MESES[mes - 1].toUpperCase()} / {ano}
          </div>
        </div>
        <div className="text-right leading-tight">
          <div className="text-4xl font-bold">
            {agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-sm capitalize text-green-100">
            {agora.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </div>
        </div>
      </header>

      {/* Corpo */}
      <div className="flex flex-1 items-center justify-center gap-10 rounded-b-lg border-4 border-t-0 border-green-800 bg-white p-6">
        {/* A cruz grande dentro de um círculo verde */}
        <div
          className="flex shrink-0 items-center justify-center rounded-full border-[10px] border-green-900"
          style={{
            width: "min(78vh, 46vw)",
            height: "min(78vh, 46vw)",
            background: "radial-gradient(circle at 42% 32%, #5cb85c 0%, #2e7d32 40%, #1b5e20 100%)",
          }}
        >
          <div
            className="grid grid-cols-7 rounded bg-white/95"
            style={{ gap: "min(0.7vmin, 7px)", padding: "min(1.4vmin, 14px)" }}
          >
            {celulas.map((dia, i) => {
              if (dia === 0) return <div key={i} style={{ width: CELL, height: CELL }} />;
              const cor = corDoDia(ocorrenciasDoDia(dia), ano, mes, dia);
              const eHoje = ehMesAtual && dia === agora.getDate();
              return (
                <div
                  key={i}
                  style={{ width: CELL, height: CELL, fontSize: `calc(${CELL} * 0.4)` }}
                  className={`flex items-center justify-center rounded border-2 font-semibold ${COR[cor]} ${eHoje ? "ring-4 ring-yellow-300" : ""}`}
                >
                  {dia}
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel lateral: contadores do mês + legenda */}
        <div className="flex h-full max-h-[80vh] flex-col justify-center gap-8">
          <div className="grid grid-cols-2 gap-5">
            <div className="overflow-hidden rounded-lg border-2 border-red-800 text-center">
              <div className="bg-gray-100 px-3 py-2 text-sm font-bold uppercase text-gray-700">
                {labelRed}
                <br />
                (no mês)
              </div>
              <div className="bg-red-600 py-5 text-6xl font-bold text-white">{contadores.red}</div>
            </div>
            <div className="overflow-hidden rounded-lg border-2 border-yellow-600 text-center">
              <div className="bg-gray-100 px-3 py-2 text-sm font-bold uppercase text-gray-700">
                {labelYellow}
                <br />
                (no mês)
              </div>
              <div className="bg-yellow-400 py-5 text-6xl font-bold text-yellow-900">
                {contadores.yellow}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4 text-sm font-semibold text-gray-600">
            <span className="flex items-center gap-2"><span className="h-4 w-7 rounded border border-black/20 bg-green-600" /> Sem ocorrência</span>
            <span className="flex items-center gap-2"><span className="h-4 w-7 rounded border border-black/20 bg-red-600" /> {labelRed}</span>
            <span className="flex items-center gap-2"><span className="h-4 w-7 rounded border border-black/20 bg-yellow-400" /> {labelYellow}</span>
            <span className="flex items-center gap-2"><span className="h-4 w-7 rounded border border-black/20 bg-gray-200" /> Dia futuro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
