"use client";
import { useState } from "react";
import { Bot, Sparkles, Save, Copy, Check } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox, VerdictBadge, inputCls } from "@/components/ui";
import { ModelSelect, useModels } from "@/components/model-select";
import { post } from "@/lib/api";
import { DIMS, avgScore, verdictOf, type Scores } from "@/lib/scoring";

export default function EvaluatePage() {
  const models = useModels();
  const [model, setModel] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [judging, setJudging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scores, setScores] = useState<Scores>({ fact: 3, reason: 3, safety: 3, helpful: 3 });
  const [ai, setAi] = useState<Scores | null>(null);
  const [rationale, setRationale] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const avg = avgScore(scores);

  async function run() {
    setLoading(true); setError(""); setResult(null); setSaved(false); setAi(null); setRationale("");
    try { setResult(await post("/api/generate", { prompt, model })); }
    catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  async function autoJudge() {
    setJudging(true); setError("");
    try {
      const d = await post<Scores & { rationale: string }>("/api/judge", { promptText: prompt, responseText: result.responseText });
      const s = { fact: d.fact, reason: d.reason, safety: d.safety, helpful: d.helpful };
      setScores(s); setAi(s); setRationale(d.rationale); setSaved(false);
    } catch (e: any) { setError("AI judge failed: " + e.message); }
    setJudging(false);
  }
  async function save() {
    setSaving(true); setError("");
    try { await post("/api/evaluate", { runId: result.runId, ...scores, rationale, ai }); setSaved(true); }
    catch (e: any) { setError(e.message); }
    setSaving(false);
  }

  return (
    <>
      <PageHeader title="New Evaluation" desc="Generate a response with Gemini, score it with the AI judge, then confirm or adjust as a human reviewer.">
        <ModelSelect models={models} value={model} onChange={setModel} auto label="Model" />
      </PageHeader>
      <Card>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a prompt to test the AI..."
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && prompt.length >= 3 && !loading) run(); }}
          className={inputCls + " h-28 resize-none"} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted">Ctrl/Cmd + Enter to run</span>
          <Button onClick={run} loading={loading} disabled={prompt.trim().length < 3}>{!loading && <Bot className="h-4 w-4" />}{loading ? "Generating..." : "Run Evaluation"}</Button>
        </div>
      </Card>
      {error && <ErrorBox msg={error} />}
      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="AI Response" right={<div className="flex items-center gap-3 font-mono text-xs text-muted"><span>{result.modelName}</span><span>{result.latencyMs}ms</span>
            <button aria-label="Copy response" onClick={() => { navigator.clipboard.writeText(result.responseText); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check className="h-3.5 w-3.5 text-pass" /> : <Copy className="h-3.5 w-3.5" />}</button></div>}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{result.responseText}</div>
          </Card>
          <Card title="Scoring" right={<Button variant="ghost" onClick={autoJudge} loading={judging} className="px-2 py-1 text-xs">{!judging && <Sparkles className="h-3 w-3" />}Auto-Judge</Button>}>
            <div className="space-y-4">
              {DIMS.map((d) => (
                <div key={d.k}>
                  <div className="mb-1.5 flex justify-between text-sm"><label htmlFor={d.k}>{d.l}</label><span className="font-mono text-pass">{scores[d.k]}</span></div>
                  <input id={d.k} type="range" min={1} max={5} value={scores[d.k]} onChange={(e) => { setScores({ ...scores, [d.k]: Number(e.target.value) }); setSaved(false); }} className="w-full" />
                </div>
              ))}
              <div className="flex items-center justify-between rounded border border-border bg-bg px-3 py-2 text-sm"><span className="text-muted">Overall {avg.toFixed(2)}</span><VerdictBadge v={verdictOf(avg)} /></div>
              <div>
                <label className="mb-1.5 block text-sm">Rationale</label>
                <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="Why did you score it this way? (min 10 characters)" className={inputCls + " h-20 resize-none text-xs"} />
              </div>
              <Button onClick={save} loading={saving} disabled={saved || rationale.trim().length < 10} className="w-full">{!saving && <Save className="h-4 w-4" />}{saved ? "Evaluation saved" : "Save Evaluation"}</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
