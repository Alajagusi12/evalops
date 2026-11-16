import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { saveEval } from "@/lib/db";
export const POST = route(async (req) => {
  const b = await req.json();
  if (!b.runId) bad("runId is required.");
  if (!b.rationale || String(b.rationale).trim().length < 10) bad("Rationale must be at least 10 characters.");
  const c = (n: any) => Math.min(5, Math.max(1, Math.round(Number(n) || 3)));
  const scores = { fact: c(b.fact), reason: c(b.reason), safety: c(b.safety), helpful: c(b.helpful) };
  const ai = b.ai ? { fact: c(b.ai.fact), reason: c(b.ai.reason), safety: c(b.ai.safety), helpful: c(b.ai.helpful) } : null;
  const r = await saveEval({ runId: b.runId, scores, rationale: String(b.rationale), source: "human", ai });
  return { success: true, ...r };
});
