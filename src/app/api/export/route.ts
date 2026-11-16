import { pool, ensureSchema } from "@/lib/db";
export const dynamic = "force-dynamic";
const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
export async function GET() {
  try {
    await ensureSchema();
    const q = await pool.query(`select e.created_at, r.kind, r.model, r.prompt, e.factuality, e.reasoning, e.safety, e.helpfulness, e.verdict, e.source, e.rationale, r.latency_ms
      from eo_evaluations e join eo_runs r on r.id=e.run_id order by e.created_at desc limit 5000`);
    const head = "created_at,kind,model,prompt,factuality,reasoning,safety,helpfulness,verdict,source,rationale,latency_ms";
    const lines = q.rows.map((r: any) => [r.created_at.toISOString(), r.kind, r.model, r.prompt, r.factuality, r.reasoning, r.safety, r.helpfulness, r.verdict, r.source, r.rationale, r.latency_ms].map(esc).join(","));
    return new Response([head, ...lines].join("\n"), { headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="evalops-history.csv"' } });
  } catch (e: any) { return new Response(e.message, { status: 500 }); }
}
