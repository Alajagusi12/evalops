import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PageHeader, Card, Stat, ErrorBox, Empty, VerdictBadge } from "@/components/ui";
import { AreaTrend, BarsChart } from "@/components/charts";
import { overview } from "@/lib/stats";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let d: Awaited<ReturnType<typeof overview>>;
  try { d = await overview(); }
  catch (e: any) { return <><PageHeader title="Overview" /><ErrorBox msg={e.message} /></>; }
  const dims = [{ name: "Factuality", value: d.dims.fact }, { name: "Reasoning", value: d.dims.reason }, { name: "Safety", value: d.dims.safety }, { name: "Helpfulness", value: d.dims.helpful }];
  const total = d.k.total || 1;
  return (
    <>
      <PageHeader title="Overview" desc="Live quality metrics across every evaluation you have run." />
      {d.k.total === 0 ? (
        <Card><Empty text="No evaluations yet." /><div className="pb-4 text-center"><Link href="/evaluate" className="text-sm text-pass hover:underline">Run your first evaluation</Link></div></Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Evaluations" value={d.k.total} />
            <Stat label="Avg score" value={`${d.k.avg_score}/5`} />
            <Stat label="Pass rate" value={`${d.k.pass_rate}%`} />
            <Stat label="Avg latency" value={`${d.k.avg_latency}ms`} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Score trend (14 days)"><AreaTrend data={d.trend} x="day" y="score" domain={[0, 5]} /></Card>
            <Card title="Average by dimension"><BarsChart data={dims} x="name" y="value" domain={[0, 5]} /></Card>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Verdicts">
              <div className="space-y-3">
                {["PASS", "PARTIAL", "FAIL"].map((v) => {
                  const n = d.dist.find((x: any) => x.verdict === v)?.n ?? 0;
                  return (<div key={v}><div className="mb-1 flex justify-between text-xs"><span className="font-mono text-muted">{v}</span><span>{n}</span></div>
                    <div className="h-2 rounded bg-bg"><div className={`h-2 rounded ${v === "PASS" ? "bg-pass" : v === "FAIL" ? "bg-fail" : "bg-warn"}`} style={{ width: `${(n / total) * 100}%` }} /></div></div>);
                })}
              </div>
            </Card>
            <Card title="Recent evaluations" className="md:col-span-2">
              <ul className="divide-y divide-border">
                {d.recent.map((r: any) => (
                  <li key={r.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="min-w-0 flex-1 truncate">{r.prompt}</span>
                    <span className="font-mono text-xs text-muted">{r.score}</span><VerdictBadge v={r.verdict} />
                    <span className="hidden text-xs text-muted sm:inline">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
