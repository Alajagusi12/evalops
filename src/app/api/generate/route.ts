import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { generate } from "@/lib/gemini";
import { saveRun } from "@/lib/db";
export const POST = route(async (req) => {
  const { prompt, model } = await req.json();
  if (!prompt || String(prompt).trim().length < 3) bad("Enter a prompt of at least 3 characters.");
  const g = await generate(String(prompt), { model: model || undefined });
  const runId = await saveRun({ kind: "generate", prompt, response: g.text, model: g.model, latencyMs: g.latencyMs });
  return { runId, responseText: g.text, modelName: g.model, latencyMs: g.latencyMs };
});
