import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { pool, ensureSchema, saveRun, saveEval } from "@/lib/db";
import { generate } from "@/lib/gemini";
import { judge } from "@/lib/judge";
import { avgScore } from "@/lib/scoring";
import { mapPool } from "@/lib/utils";
export const POST = route(async (req) => {
  const { limit } = await req.json().catch(() => ({}));
  const n = Math.min(6, Math.max(1, Number(limit) || 3));
  await ensureSchema();
  const base = await pool.query(
    `select r.id, r.prompt, r.model, round((e.factuality+e.reasoning+e.safety+e.helpfulness)/4.0,2)::float score
     from eo_runs r join eo_evaluations e on e.run_id=r.id where r.kind in ('generate','batch')
     order by e.created_at desc limit $1`, [n]);
  if (!base.rows.length) bad("No evaluated runs yet. Run a few evaluations first, then re-test them here.");
  const rows = await mapPool(base.rows, 3, async (b: any) => {
    try {
      const g = await generate(b.prompt);
      const j = await judge(b.prompt, g.text);
      const runId = await saveRun({ kind: "regression", prompt: b.prompt, response: g.text, model: g.model, latencyMs: g.latencyMs, meta: { baselineRunId: b.id } });
      await saveEval({ runId, scores: j, rationale: j.rationale, source: "ai", ai: j });
      const after = avgScore(j);
      return { prompt: b.prompt, before: b.score as number, after, delta: Math.round((after - b.score) * 100) / 100, modelBefore: b.model, modelAfter: g.model };
    } catch (e: any) { return { prompt: b.prompt, error: e.message as string }; }
  });
  return { rows };
});
