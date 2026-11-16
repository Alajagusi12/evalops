"use client";
import { useEffect, useState } from "react";
import { GitCompare, Trophy } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox, VerdictBadge, inputCls } from "@/components/ui";
import { ModelSelect, useModels } from "@/components/model-select";
import { post } from "@/lib/api";
import { DIMS } from "@/lib/scoring";

export default function ComparePage() {
  const models = useModels();
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!models.length) return;
    const flash = models.filter((m) => /flash/.test(m));
    const pool = flash.length >= 2 ? flash : models;
    setA((x) => x || pool[0]); setB((x) => x || pool[1] || pool[0]);
  }, [models]);

  async function run() {
    setLoading(true); setError(""); setRes(null);
    try { setRes(await post("/api/compare", { prompt, modelA: a, modelB: b })); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  const side = (k: "a" | "b", label: string) => {
    const r = res[k]; const win = res.winner === k.toUpperCase();
    return (
      <Card key={k} title={`${label} · ${r.model}`} className={win ? "border-pass/50" : ""}
        right={<div className="flex items-center gap-2">{win && <Trophy className="h-4 w-4 text-pass" />}<VerdictBadge v={r.verdict} /></div>}>
        <div className="mb-3 grid grid-cols-5 gap-2 text-center font-mono text-xs">
          {DIMS.map((d) => <div key={d.k} className="rounded border border-border bg-bg py-1.5"><div className="text-muted">{d.l.slice(0, 4)}</div><div className="text-sm text-fg">{r.scores[d.k]}</div></div>)}
          <div className="rounded border border-pass/30 bg-pass/10 py-1.5"><div className="text-pass">Avg</div><div className="text-sm text-pass">{r.avg}</div></div>
        </div>
        <p className="mb-3 text-xs text-muted">{r.latencyMs}ms · {r.rationale}</p>
        <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">{r.response}</div>
      </Card>
    );
  };

  return (
    <>
      <PageHeader title="Model Comparison" desc="Run one prompt through two Gemini models and let the AI judge score both." />
      <Card>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt to send to both models..." className={inputCls + " h-24 resize-none"} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4"><ModelSelect models={models} value={a} onChange={setA} label="A" /><ModelSelect models={models} value={b} onChange={setB} label="B" /></div>
          <Button onClick={run} loading={loading} disabled={prompt.trim().length < 3 || !a || !b}>{!loading && <GitCompare className="h-4 w-4" />}{loading ? "Comparing..." : "Compare"}</Button>
        </div>
      </Card>
      {error && <ErrorBox msg={error} />}
      {res && (
        <>
          <div className="rounded-lg border border-border bg-surface p-3 text-center text-sm">
            {res.winner === "TIE" ? "Result: tie (scores within 0.25)" : <>Winner: <span className="font-semibold text-pass">Model {res.winner} · {res[res.winner.toLowerCase()].model}</span></>}
          </div>
          <div className="grid gap-6 md:grid-cols-2">{side("a", "Model A")}{side("b", "Model B")}</div>
        </>
      )}
    </>
  );
}
