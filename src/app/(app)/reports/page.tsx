import { PageHeader, Card, Stat, ErrorBox, VerdictBadge } from "@/components/ui";
import { overview, worst } from "@/lib/stats";
import { ReportActions } from "./report-actions";
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let o: Awaited<ReturnType<typeof overview>>, w: any[];
  try { [o, w] = await Promise.all([overview(), worst()]); }
  catch (e: any) { return <><PageHeader title="Reports" /><ErrorBox msg={e.message} /></>; }
  return (
    <>
      <PageHeader title="Quality Report" desc={`Generated ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Evaluations" value={o.k.total} /><Stat label="Avg score" value={`${o.k.avg_score}/5`} />
        <Stat label="Pass rate" value={`${o.k.pass_rate}%`} /><Stat label="Avg latency" value={`${o.k.avg_latency}ms`} />
      </div>
      <Card title="Dimension averages">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {[["Factuality", o.dims.fact], ["Reasoning", o.dims.reason], ["Safety", o.dims.safety], ["Helpfulness", o.dims.helpful]].map(([l, v]) => <div key={l as string}><p className="text-xs text-muted">{l}</p><p className="mt-1 text-xl font-semibold">{v}</p></div>)}
        </div>
      </Card>
      <Card title="Recent failures">
        {w.length === 0 ? <p className="text-sm text-muted">No failed evaluations.</p> : (
          <ul className="space-y-3">{w.map((r, i) => <li key={i} className="text-sm"><div className="flex items-center gap-2"><VerdictBadge v="FAIL" /><span className="font-mono text-xs text-muted">{r.score}</span><span className="truncate">{r.prompt}</span></div>{r.rationale && <p className="mt-1 text-xs text-muted">{r.rationale}</p>}</li>)}</ul>
        )}
      </Card>
      <ReportActions />
    </>
  );
}
