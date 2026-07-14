import { Elysia, t } from "elysia";
import {
  listarOcorrencias,
  criarOcorrencia,
  atualizarOcorrencia,
  excluirOcorrencia,
} from "./cipa_db";

// Validação do "sistema" na URL: só aceita 'trabalho' ou 'publico'.
const sistemaParam = t.Union([t.Literal("trabalho"), t.Literal("publico")]);

// Validação do corpo (body) ao criar/editar uma ocorrência.
const corpoOcorrencia = t.Object({
  ano: t.Number(),
  mes: t.Number(),
  dia: t.Number(),
  gravidade: t.Union([t.Literal("red"), t.Literal("yellow")]),
  tipo: t.Optional(t.String()),
  categoria: t.Optional(t.String()),
  descricao: t.Optional(t.String()),
  observacoes: t.Optional(t.String()),
});

const cipaRoutes = new Elysia({ prefix: "/cipa" })
  // Listar ocorrências de um mês
  .get(
    "/:sistema/ocorrencias",
    ({ params, query }) => listarOcorrencias(params.sistema, query.ano, query.mes),
    {
      params: t.Object({ sistema: sistemaParam }),
      query: t.Object({ ano: t.Number(), mes: t.Number() }),
      detail: { summary: "Lista as ocorrências de um mês", tags: ["cipa"] },
    },
  )
  // Criar ocorrência
  .post(
    "/:sistema/ocorrencias",
    ({ params, body }) => criarOcorrencia(params.sistema, body),
    {
      params: t.Object({ sistema: sistemaParam }),
      body: corpoOcorrencia,
      detail: { summary: "Cria uma ocorrência", tags: ["cipa"] },
    },
  )
  // Editar ocorrência
  .put(
    "/:sistema/ocorrencias/:id",
    async ({ params, body, set }) => {
      const oc = await atualizarOcorrencia(params.sistema, params.id, body);
      if (!oc) {
        set.status = 404;
        return { error: "Ocorrência não encontrada" };
      }
      return oc;
    },
    {
      params: t.Object({ sistema: sistemaParam, id: t.Number() }),
      body: corpoOcorrencia,
      detail: { summary: "Edita uma ocorrência", tags: ["cipa"] },
    },
  )
  // Excluir ocorrência
  .delete(
    "/:sistema/ocorrencias/:id",
    async ({ params, set }) => {
      const ok = await excluirOcorrencia(params.sistema, params.id);
      if (!ok) {
        set.status = 404;
        return { error: "Ocorrência não encontrada" };
      }
      return { ok: true };
    },
    {
      params: t.Object({ sistema: sistemaParam, id: t.Number() }),
      detail: { summary: "Exclui uma ocorrência", tags: ["cipa"] },
    },
  );

export { cipaRoutes };
