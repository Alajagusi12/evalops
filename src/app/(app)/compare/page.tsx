"use client";
import { useState } from "react";
import { GitCompareArrows, Loader2 } from "lucide-react";

export default function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultA, setResultA] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);

  const handleCompare = async () => {
    if (prompt.length < 3) return;
    setLoading(true); setResultA(null); setResultB(null);

    const [resA, resB] = await Promise.all([
      fetch("/api/generate", { method: "POST", body: JSON.stringify({ promptText: prompt, model: "gemini-flash-latest" }) }),
      fetch("/api/generate", { method: "POST", body: JSON.stringify({ promptText: prompt, model: "gemini-1.5-flash" }) })
    ]);

    setResultA(await resA.json());
    setResultB(await resB.json());
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Model Comparison Lab</h1>
        <p className="text-sm text-muted mt-1">Compare outputs from different models side-by-side.</p>
      </div>

      <div className="rounded border border-border bg-surface p-4 space-y-4">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to compare models..." className="w-full h-24 rounded border border-border bg-bg p-3 text-sm focus:border-pass outline-none resize-none" />
        <div className="flex justify-end">
          <button onClick={handleCompare} disabled={loading || prompt.length < 3}
            className="flex items-center gap-2 rounded bg-pass/10 border border-pass/30 px-4 py-2 text-sm font-medium text-pass hover:bg-pass/20 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompareArrows className="h-4 w-4" />}
            {loading ? "Comparing..." : "Compare Models"}
          </button>
        </div>
      </div>

      {(resultA || resultB) && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-border bg-surface flex flex-col">
            <div className="border-b border-border px-4 py-2 text-xs font-mono text-muted flex justify-between">
              <span>MODEL A (Flash Latest)</span>
              <span>{resultA?.latencyMs}ms</span>
            </div>
            <div className="p-4 text-sm whitespace-pre-wrap flex-1">{resultA?.responseText || "Failed to load"}</div>
          </div>
          <div className="rounded border border-border bg-surface flex flex-col">
            <div className="border-b border-border px-4 py-2 text-xs font-mono text-muted flex justify-between">
              <span>MODEL B (1.5 Flash)</span>
              <span>{resultB?.latencyMs}ms</span>
            </div>
            <div className="p-4 text-sm whitespace-pre-wrap flex-1">{resultB?.responseText || "Failed to load"}</div>
          </div>
        </div>
      )}
    </div>
  );
}