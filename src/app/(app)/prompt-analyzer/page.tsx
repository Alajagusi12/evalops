"use client";
import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox, Stat, inputCls } from "@/components/ui";
import { post } from "@/lib/api";

export default function AnalyzerPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError(""); setRes(null);
    try { setRes(await post("/api/analyze", { promptText: prompt })); } catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  const list = (items: string[], cls: string) => <ul className="space-y-2 text-sm">{items.map((t, i) => <li key={i} className="flex gap-2"><span className={cls}>●</span><span>{t}</span></li>)}</ul>;

  return (
    <>
      <PageHeader title="Prompt Analyzer" desc="Score a prompt for clarity and get a stronger rewrite." />
      <Card>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Paste a prompt to analyze..." className={inputCls + " h-32 resize-none"} />
        <div className="mt-3 flex justify-end"><Button onClick={run} loading={loading} disabled={prompt.trim().length < 3}>{!loading && <Sparkles className="h-4 w-4" />}{loading ? "Analyzing..." : "Analyze Prompt"}</Button></div>
      </Card>
      {error && <ErrorBox msg={error} />}
      {res && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Stat label="Clarity score" value={`${res.score}/10`} />
            <Card title="Strengths" className="md:col-span-1">{list(res.strengths, "text-pass")}</Card>
            <Card title="Weaknesses">{list(res.weaknesses, "text-warn")}</Card>
          </div>
          <Card title="Improved prompt" right={<button aria-label="Copy" onClick={() => { navigator.clipboard.writeText(res.improved); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check className="h-4 w-4 text-pass" /> : <Copy className="h-4 w-4 text-muted" />}</button>}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{res.improved}</p>
          </Card>
        </>
      )}
    </>
  );
}
