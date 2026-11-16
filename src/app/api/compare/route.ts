import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { generate } from "@/lib/gemini";
import { judge } from "@/lib/judge";
import { saveRun, saveEval } from "@/lib/db";
import { avgScore, verdictOf } from "@/lib/scoring";
export const POST = route(async (req) => {
  const { prompt, modelA, modelB } = await req.json();
  if (!prompt || String(prompt).trim().length < 3) bad("Enter a prompt of at least 3 characters.");
  if (!modelA || !modelB) bad("Pick two models to compare.");
  const run = async (model: string) => {
    const g = await generate(prompt, { model, strict: true });
    const j = await judge(prompt, g.text);
    const runId = await saveRun({ kind: "compare", prompt, response: g.text, model: g.model, latencyMs: g.latencyMs });
    await saveEval({ runId, scores: j, rationale: j.rationale, source: "ai", ai: j });
    const avg = avgScore(j);
    return { model: g.model, response: g.text, latencyMs: g.latencyMs, scores: j, avg, verdict: verdictOf(avg), rationale: j.rationale };
  };
  const [a, b] = await Promise.all([run(modelA), run(modelB)]);
  const diff = a.avg - b.avg;
  return { a, b, winner: Math.abs(diff) < 0.25 ? "TIE" : diff > 0 ? "A" : "B" };
});
