import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { generate } from "@/lib/gemini";
import { overview, calibration, worst } from "@/lib/stats";
export const POST = route(async () => {
  const [o, c, w] = await Promise.all([overview(), calibration(), worst()]);
  if (!o.k.total) bad("No evaluations yet. Run some evaluations first.");
  const g = await generate(JSON.stringify({ overview: o.k, dimensions: o.dims, verdicts: o.dist, calibration: c.m, recentFailures: w }), {
    system: "You are an AI quality lead. The user message is JSON metrics from an LLM evaluation platform. Write a concise executive summary: 1 headline sentence, then 4 short bullet points (findings, risks, recommended actions). Plain text, no markdown headers.",
    temperature: 0.4,
  });
  return { summary: g.text };
});
