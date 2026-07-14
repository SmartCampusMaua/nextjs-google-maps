// Acesso à API da CIPA (mesmo padrão de lib/api.ts).
// Chamado do navegador (Client Components), por isso usa NEXT_PUBLIC_API_URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Sistema = "trabalho" | "publico";
export type Gravidade = "red" | "yellow";

// Uma ocorrência como o servidor devolve (id numérico vindo do banco).
export type Ocorrencia = {
  id: number;
  sistema: Sistema;
  ano: number;
  mes: number;
  dia: number;
  gravidade: Gravidade;
  tipo: string | null;
  categoria: string | null;
  descricao: string;
  observacoes: string;
};

// Dados enviados ao criar/editar (o servidor cuida do id e do sistema).
export type OcorrenciaEntrada = {
  ano: number;
  mes: number;
  dia: number;
  gravidade: Gravidade;
  tipo?: string;
  categoria?: string;
  descricao?: string;
  observacoes?: string;
};

const base = (sistema: Sistema) => `${API_URL}/cipa/${sistema}/ocorrencias`;

export async function listarOcorrencias(
  sistema: Sistema,
  ano: number,
  mes: number,
): Promise<Ocorrencia[]> {
  const res = await fetch(`${base(sistema)}?ano=${ano}&mes=${mes}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao listar ocorrências (${res.status})`);
  return res.json();
}

export async function criarOcorrencia(
  sistema: Sistema,
  dados: OcorrenciaEntrada,
): Promise<Ocorrencia> {
  const res = await fetch(base(sistema), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(`Falha ao criar ocorrência (${res.status})`);
  return res.json();
}

export async function atualizarOcorrencia(
  sistema: Sistema,
  id: number,
  dados: OcorrenciaEntrada,
): Promise<Ocorrencia> {
  const res = await fetch(`${base(sistema)}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(`Falha ao editar ocorrência (${res.status})`);
  return res.json();
}

export async function excluirOcorrencia(sistema: Sistema, id: number): Promise<void> {
  const res = await fetch(`${base(sistema)}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Falha ao excluir ocorrência (${res.status})`);
}
