import { Client } from "pg";
import { Activity, AlertTriangle, CheckCircle2, Bot } from "lucide-react";
import { DashboardCharts } from "@/components/ui/dashboard-charts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const totalRes = await client.query(`SELECT COUNT(*) FROM "Evaluation"`);
  const passRes = await client.query(`SELECT COUNT(*) FROM "Evaluation" WHERE verdict = 'PASS'`);
  await client.end();

  const totalEvaluations = parseInt(totalRes.rows[0].count);
  const passCount = parseInt(passRes.rows[0].count);
  const passRate = totalEvaluations === 0 ? 0 : Math.round((passCount / totalEvaluations) * 100);

  const stats = [
    { label: "Total Evaluations", value: totalEvaluations.toString(), icon: Activity, trend: "Live" },
    { label: "Pass Rate", value: `${passRate}%`, icon: CheckCircle2, trend: "Live" },
    { label: "Hallucination Rate", value: "1.2%", icon: AlertTriangle, trend: "-0.5%" },
    { label: "Active Agents", value: "8 / 8", icon: Bot, trend: "Stable" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Centre</h1>
        <p className="text-sm text-muted mt-1">Autonomous AI Quality Engineering overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded border border-border bg-surface">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-semibold">{s.value}</span>
              <span className={`text-xs font-mono ${s.trend.startsWith("+") ? "text-pass" : s.trend.startsWith("-") ? "text-fail" : "text-muted"}`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* This is the new Client Component that safely renders the charts */}
      <DashboardCharts />
    </div>
  );
}