import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Download } from "lucide-react";
import { PageHeader, Card, VerdictBadge, ErrorBox, Empty } from "@/components/ui";
import { pool, ensureSchema } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function HistoryPage({ searchParams }: { searchParams: { q?: string; verdict?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const verdict = ["PASS", "PARTIAL", "FAIL"].includes(searchParams.verdict ?? "") ? searchParams.verdict! : "";
  let rows: any[] = [];
  try {
    await ensureSchema();
    const res = await pool.query(
      `select e.id, r.prompt, r.model, r.kind, e.verdict, e.source, e.rationale, round((e.factuality+e.reasoning+e.safety+e.helpfulness)/4.0,1)::float score, e.created_at
       from eo_evaluations e join eo_runs r on r.id=e.run_id
       where ($1 = '' or r.prompt ilike '%' || $1 || '%') and ($2 = '' or e.verdict = $2)
       order by e.created_at desc limit 100`, [q, verdict]);
    rows = res.rows;
  } catch (e: any) { return <><PageHeader title="Evaluation History" /><ErrorBox msg={e.message} /></>; }

  return (
    <>
      <PageHeader title="Evaluation History" desc="Search and filter every saved evaluation.">
        <a href="/api/export" className="inline-flex items-center gap-2 rounded border border-border bg-raised px-3 py-2 text-sm hover:bg-border/60"><Download className="h-4 w-4" />Export CSV</a>
      </PageHeader>
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Search prompts..." className="min-w-0 flex-1 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-pass" />
        <select name="verdict" defaultValue={verdict} className="rounded border border-border bg-surface px-3 py-2 text-sm"><option value="">All verdicts</option><option>PASS</option><option>PARTIAL</option><option>FAIL</option></select>
        <button className="rounded border border-pass/30 bg-pass/10 px-4 py-2 text-sm text-pass hover:bg-pass/20">Filter</button>
        {(q || verdict) && <Link href="/history" className="self-center text-xs text-muted hover:text-fg">Clear</Link>}
      </form>
      <Card className="overflow-x-auto p-0">
        {rows.length === 0 ? <Empty text="No evaluations found." /> : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-bg font-mono text-xs text-muted"><tr>{["Prompt", "Model", "Source", "Verdict", "Score", "When"].map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-bg/50" title={r.rationale ?? ""}>
                  <td className="max-w-xs truncate px-4 py-3">{r.prompt}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{r.model ?? "-"}</td>
                  <td className="px-4 py-3 text-xs text-muted">{r.source}</td>
                  <td className="px-4 py-3"><VerdictBadge v={r.verdict} /></td>
                  <td className="px-4 py-3 font-mono">{r.score}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
