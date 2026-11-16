import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { generate } from "@/lib/gemini";
import { judge } from "@/lib/judge";
import { saveRun, saveEval } from "@/lib/db";
import { avgScore, verdictOf } from "@/lib/scoring";
import { mapPool } from "@/lib/utils";
export const POST = route(async (req) => {
  const { prompts, model } = await req.json();
  const list = (Array.isArray(prompts) ? prompts : []).map((p: any) => String(p).trim()).filter(Boolean).slice(0, 8);
  if (!list.length) bad("Add at least one prompt (one per line, max 8).");
  const batchId = crypto.randomUUID();
  const rows = await mapPool(list, 3, async (prompt) => {
    try {
      const g = await generate(prompt, { model: model || undefined });
      const j = await judge(prompt, g.text);
      const runId = await saveRun({ kind: "batch", prompt, response: g.text, model: g.model, latencyMs: g.latencyMs, meta: { batchId } });
      await saveEval({ runId, scores: j, rationale: j.rationale, source: "ai", ai: j });
      const avg = avgScore(j);
      return { prompt, model: g.model, latencyMs: g.latencyMs, scores: j, avg, verdict: verdictOf(avg), rationale: j.rationale };
    } catch (e: any) { return { prompt, error: e.message as string }; }
  });
  return { batchId, rows };
});
