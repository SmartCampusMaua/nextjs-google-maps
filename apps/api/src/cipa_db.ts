// Banco de dados da CIPA — PostgreSQL via o cliente nativo do Bun (Bun.SQL).
// Nenhuma biblioteca extra: o Bun já traz o driver de Postgres embutido.
// Guarda as ocorrências das cruzes: Acidentes de Trabalho e Público Flutuante.
import { SQL } from "bun";

// A conexão vem do .env (DATABASE_URL); com um padrão local de fallback.
const sql = new SQL(
  process.env.DATABASE_URL ?? "postgres://smartcampus:smartcampus@localhost:5432/smartcampus",
);

// Cria a tabela na primeira execução (idempotente — só cria se não existir).
await sql`
  CREATE TABLE IF NOT EXISTS ocorrencias (
    id          SERIAL PRIMARY KEY,
    sistema     TEXT    NOT NULL,                 -- 'trabalho' | 'publico'
    ano         INTEGER NOT NULL,
    mes         INTEGER NOT NULL,                 -- 1..12
    dia         INTEGER NOT NULL,
    gravidade   TEXT    NOT NULL,                 -- 'red' | 'yellow'
    tipo        TEXT,                              -- 'acidente' | 'incidente' (só publico)
    categoria   TEXT,                              -- chave da categoria (só publico)
    descricao   TEXT    NOT NULL DEFAULT '',
    observacoes TEXT    NOT NULL DEFAULT '',
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

export type Sistema = "trabalho" | "publico";

export type Ocorrencia = {
  id: number;
  sistema: Sistema;
  ano: number;
  mes: number;
  dia: number;
  gravidade: "red" | "yellow";
  tipo: string | null;
  categoria: string | null;
  descricao: string;
  observacoes: string;
};

// Dados que chegam do site para criar/editar (id e sistema vêm da URL).
export type OcorrenciaEntrada = {
  ano: number;
  mes: number;
  dia: number;
  gravidade: "red" | "yellow";
  tipo?: string;
  categoria?: string;
  descricao?: string;
  observacoes?: string;
};

// Colunas devolvidas ao site (na ordem do tipo Ocorrencia).
const COLUNAS = sql`id, sistema, ano, mes, dia, gravidade, tipo, categoria, descricao, observacoes`;

export async function listarOcorrencias(
  sistema: Sistema,
  ano: number,
  mes: number,
): Promise<Ocorrencia[]> {
  return (await sql`
    SELECT ${COLUNAS} FROM ocorrencias
    WHERE sistema = ${sistema} AND ano = ${ano} AND mes = ${mes}
    ORDER BY dia, id
  `) as Ocorrencia[];
}

export async function criarOcorrencia(sistema: Sistema, o: OcorrenciaEntrada): Promise<Ocorrencia> {
  const [row] = await sql`
    INSERT INTO ocorrencias (sistema, ano, mes, dia, gravidade, tipo, categoria, descricao, observacoes)
    VALUES (${sistema}, ${o.ano}, ${o.mes}, ${o.dia}, ${o.gravidade},
            ${o.tipo ?? null}, ${o.categoria ?? null}, ${o.descricao ?? ""}, ${o.observacoes ?? ""})
    RETURNING ${COLUNAS}
  `;
  return row as Ocorrencia;
}

export async function atualizarOcorrencia(
  sistema: Sistema,
  id: number,
  o: OcorrenciaEntrada,
): Promise<Ocorrencia | null> {
  const [row] = await sql`
    UPDATE ocorrencias SET
      ano = ${o.ano}, mes = ${o.mes}, dia = ${o.dia}, gravidade = ${o.gravidade},
      tipo = ${o.tipo ?? null}, categoria = ${o.categoria ?? null},
      descricao = ${o.descricao ?? ""}, observacoes = ${o.observacoes ?? ""}
    WHERE id = ${id} AND sistema = ${sistema}
    RETURNING ${COLUNAS}
  `;
  return (row as Ocorrencia) ?? null;
}

export async function excluirOcorrencia(sistema: Sistema, id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM ocorrencias WHERE id = ${id} AND sistema = ${sistema} RETURNING id`;
  return rows.length > 0;
}
