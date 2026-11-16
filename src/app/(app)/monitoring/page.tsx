import { AlertTriangle } from "lucide-react";
import { PageHeader, Card, ErrorBox, Empty } from "@/components/ui";
import { AreaTrend } from "@/components/charts";
import { monitoring, overview } from "@/lib/stats";
export const dynamic = "force-dynamic";

export default async function MonitoringPage() {
  let m: Awaited<ReturnType<typeof monitoring>>, o: Awaited<ReturnType<typeof overview>>;
  try { [m, o] = await Promise.all([monitoring(), overview()]); }
  catch (e: any) { return <><PageHeader title="AI Monitoring" /><ErrorBox msg={e.message} /></>; }
  const lastPass = o.trend.at(-1)?.pass;
  const lastLat = m.latency.at(-1)?.avg;
  const alerts: string[] = [];
  if (lastPass !== undefined && lastPass < 60) alerts.push(`Pass rate today is ${lastPass}% (below the 60% threshold).`);
  if (lastLat !== undefined && lastLat > 8000) alerts.push(`Average latency today is ${lastLat}ms (above 8000ms).`);
  return (
    <>
      <PageHeader title="AI Monitoring" desc="Latency and quality over the last 14 days, per model." />
      {alerts.map((a) => <div key={a} className="flex items-center gap-2 rounded-lg border border-warn/30 bg-warn/10 p-3 text-sm text-warn"><AlertTriangle className="h-4 w-4" />{a}</div>)}
      {m.latency.length === 0 ? <Card><Empty text="No data yet. Run some evaluations." /></Card> : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Average latency (ms)"><AreaTrend data={m.latency} x="day" y="avg" color="#6366F1" /></Card>
          <Card title="p95 latency (ms)"><AreaTrend data={m.latency} x="day" y="p95" color="#F59E0B" /></Card>
          <Card title="Pass rate (%)" className="md:col-span-2"><AreaTrend data={o.trend} x="day" y="pass" domain={[0, 100]} /></Card>
        </div>
      )}
      {m.models.length > 0 && (
        <Card title="By model" className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-bg font-mono text-xs text-muted"><tr>{["Model", "Runs", "Avg latency", "Avg score", "Pass rate"].map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border font-mono">
              {m.models.map((r: any) => <tr key={r.model}><td className="px-4 py-3">{r.model}</td><td className="px-4">{r.runs}</td><td className="px-4">{r.latency}ms</td><td className="px-4">{r.score}</td><td className="px-4">{r.pass}%</td></tr>)}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
