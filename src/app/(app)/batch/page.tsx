"use client";
import { useState } from "react";
import { Download, Layers } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox, VerdictBadge, Stat, inputCls } from "@/components/ui";
import { post } from "@/lib/api";

export default function BatchPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const count = text.split("\n").filter((l) => l.trim()).length;

  async function run() {
    setLoading(true); setError(""); setRows(null);
    try { setRows((await post("/api/batch", { prompts: text.split("\n") })).rows); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  const ok = (rows ?? []).filter((r) => !r.error);
  const avg = ok.length ? ok.reduce((s, r) => s + r.avg, 0) / ok.length : 0;
  const pass = ok.length ? (ok.filter((r) => r.verdict === "PASS").length / ok.length) * 100 : 0;

  function csv() {
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
    const body = ["prompt,verdict,avg,fact,reason,safety,helpful,rationale", ...ok.map((r) => [r.prompt, r.verdict, r.avg, r.scores.fact, r.scores.reason, r.scores.safety, r.scores.helpful, r.rationale].map(esc).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" })); a.download = "evalops-dataset-run.csv"; a.click();
  }

  return (
    <>
      <PageHeader title="Dataset Evaluation" desc="Paste up to 8 prompts, one per line. Each is generated and AI-judged automatically." />
      <Card>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={"What is the capital of Australia?\nExplain recursion to a 10 year old.\nIs it safe to mix bleach and ammonia?"} className={inputCls + " h-36 resize-none font-mono text-xs"} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted">{count} prompt{count === 1 ? "" : "s"}{count > 8 && " (only the first 8 run)"}</span>
          <Button onClick={run} loading={loading} disabled={count === 0}>{!loading && <Layers className="h-4 w-4" />}{loading ? "Running dataset..." : "Run Dataset"}</Button>
        </div>
      </Card>
      {error && <ErrorBox msg={error} />}
      {rows && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Stat label="Prompts" value={rows.length} hint={`${rows.length - ok.length} failed`} />
            <Stat label="Average score" value={avg.toFixed(2)} />
            <Stat label="Pass rate" value={`${pass.toFixed(0)}%`} />
          </div>
          <Card title="Results" right={ok.length > 0 && <Button variant="ghost" onClick={csv} className="px-2 py-1 text-xs"><Download className="h-3 w-3" />CSV</Button>}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="font-mono text-xs text-muted"><tr><th className="py-2 pr-4 font-normal">Prompt</th><th className="pr-4 font-normal">Verdict</th><th className="pr-4 font-normal">Score</th><th className="font-normal">Rationale</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {rows.map((r, i) => (
                    <tr key={i} className="align-top">
                      <td className="max-w-xs py-3 pr-4">{r.prompt}</td>
                      {r.error ? <td colSpan={3} className="py-3 text-fail">{r.error}</td> : <>
                        <td className="pr-4 pt-3"><VerdictBadge v={r.verdict} /></td>
                        <td className="pr-4 pt-3 font-mono">{r.avg}</td>
                        <td className="max-w-md py-3 text-xs text-muted">{r.rationale}</td></>}
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
