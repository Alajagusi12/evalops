"use client";
import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export default function PromptAnalyzerPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (prompt.length < 5) return;
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ promptText: prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prompt Quality Analyzer</h1>
        <p className="text-sm text-muted mt-1">Analyze prompts for ambiguity, missing context, or conflicts.</p>
      </div>

      <div className="rounded border border-border bg-surface p-4 space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your prompt here to analyze it..."
          className="w-full h-32 rounded border border-border bg-bg p-3 text-sm focus:border-pass outline-none resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || prompt.length < 5}
            className="flex items-center gap-2 rounded bg-pass/10 border border-pass/30 px-4 py-2 text-sm font-medium text-pass hover:bg-pass/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Analyze Prompt"}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded border border-border bg-surface p-6 space-y-4">
          <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Analysis Results</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-pass mt-0.5" />
              <div>
                <p className="text-sm font-medium text-fg">Clarity Score: {result.clarityScore}/10</p>
                <p className="text-xs text-muted mt-1">{result.feedback}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}