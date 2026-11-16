"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox, Stat } from "@/components/ui";
import { post } from "@/lib/api";

export default function RegressionPage() {
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError(""); setRows(null);
    try { setRows((await post("/api/regression", { limit })).rows); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  const ok = (rows ?? []).filter((r) => !r.error);
  const regressed = ok.filter((r) => r.delta <= -0.5).length;
  const mean = ok.length ? ok.reduce((s, r) => s + r.delta, 0) / ok.length : 0;

  return (
    <>
      <PageHeader title="Regression Testing" desc="Re-run your most recent evaluated prompts against the current model and compare scores with the original run." />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">Prompts to re-test
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded border border-border bg-bg px-2 py-1.5 font-mono text-xs text-fg">{[1, 3, 5, 6].map((n) => <option key={n}>{n}</option>)}</select>
          </label>
          <Button onClick={run} loading={loading}>{!loading && <RotateCcw className="h-4 w-4" />}{loading ? "Re-testing..." : "Run Regression"}</Button>
        </div>
      </Card>
      {error && <ErrorBox msg={error} />}
      {rows && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Mean change" value={`${mean >= 0 ? "+" : ""}${mean.toFixed(2)}`} />
            <Stat label="Regressions" value={regressed} hint="score dropped by 0.5 or more" />
          </div>
          <Card title="Before vs after">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="font-mono text-xs text-muted"><tr><th className="py-2 pr-4 font-normal">Prompt</th><th className="pr-4 font-normal">Before</th><th className="pr-4 font-normal">After</th><th className="font-normal">Change</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="max-w-sm truncate py-3 pr-4">{r.prompt}</td>
                      {r.error ? <td colSpan={3} className="text-fail">{r.error}</td> : <>
                        <td className="pr-4 font-mono">{r.before}</td><td className="pr-4 font-mono">{r.after}</td>
                        <td className={`font-mono ${r.delta < -0.25 ? "text-fail" : r.delta > 0.25 ? "text-pass" : "text-muted"}`}>{r.delta > 0 ? "+" : ""}{r.delta}</td></>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
