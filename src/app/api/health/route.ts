import { route } from "@/lib/route";
import { pool, ensureSchema } from "@/lib/db";
import { generate } from "@/lib/gemini";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const GET = route(async () => {
  const out: any = { db: "ok", gemini: "ok" };
  try { await ensureSchema(); await pool.query("select 1"); } catch (e: any) { out.db = e.message; }
  try {
    const g = await generate("Reply with the single word: pong", { temperature: 0 });
    out.model = g.model; out.latencyMs = g.latencyMs; out.reply = g.text.slice(0, 30);
  } catch (e: any) { out.gemini = e.message; }
  out.ok = out.db === "ok" && out.gemini === "ok";
  return out;
});
