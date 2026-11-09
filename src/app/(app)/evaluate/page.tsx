"use client";
import { useState } from "react";
import { Bot, Loader2, CheckCircle2 } from "lucide-react";

export default function EvaluatePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scores, setScores] = useState({ fact: 3, reason: 3, safety: 3 });
  const [rationale, setRationale] = useState("");
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (prompt.length < 3) return;
    setLoading(true); 
    setResult(null); 
    setSaved(false);
    
    try {
      const res = await fetch("/api/generate", { 
        method: "POST", 
        body: JSON.stringify({ promptText: prompt }) 
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    if (rationale.length < 10) return alert("Rationale must be at least 10 characters.");
    
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST", 
        body: JSON.stringify({
          responseId: result.responseId, 
          factualityScore: scores.fact,
          reasoningScore: scores.reason, 
          safetyScore: scores.safety, 
          rationale
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Evaluation</h1>
        <p className="text-sm text-muted mt-1">Submit a prompt to the AI Agents for evaluation.</p>
      </div>

      <div className="rounded border border-border bg-surface p-4 space-y-4">
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to test the AI..." 
          className="w-full h-24 rounded border border-border bg-bg p-3 text-sm focus:border-pass outline-none resize-none" 
        />
        <div className="flex justify-end">
          <button 
            onClick={handleGenerate} 
            disabled={loading || prompt.length < 3}
            className="flex items-center gap-2 rounded bg-pass/10 border border-pass/30 px-4 py-2 text-sm font-medium text-pass hover:bg-pass/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            {loading ? "Agents Evaluating..." : "Run Evaluation"}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded border border-border bg-surface">
            <div className="border-b border-border px-4 py-2 text-xs font-mono text-muted flex justify-between">
              <span>AI RESPONSE</span>
              <span>{result.latencyMs}ms</span>
            </div>
            <div className="p-4 text-sm whitespace-pre-wrap leading-relaxed">
              {result.responseText}
            </div>
          </div>

          <div className="rounded border border-border bg-surface flex flex-col">
            <div className="border-b border-border px-4 py-2 text-xs font-mono text-muted flex justify-between">
              <span>AGENT SCORING</span>
              {saved && <span className="text-pass flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Evaluation Saved</span>}
            </div>
            <div className="p-4 space-y-6 flex-1">
              {[
                { k: "fact", l: "Factuality" }, 
                { k: "reason", l: "Reasoning" }, 
                { k: "safety", l: "Safety" }
              ].map((item) => (
                <div key={item.k}>
                  <div className="flex justify-between text-sm mb-2">
                    <label>{item.l}</label>
                    <span className="font-mono text-pass">{(scores as any)[item.k]}</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" 
                    value={(scores as any)[item.k]}
                    onChange={(e) => setScores({ ...scores, [item.k]: Number(e.target.value) })} 
                    className="w-full" 
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm mb-2">Rationale</label>
                <textarea 
                  value={rationale} 
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Why did you score it this way?" 
                  className="w-full h-24 rounded border border-border bg-bg p-3 text-sm focus:border-pass outline-none resize-none" 
                />
              </div>
              <button 
                onClick={handleSave} 
                disabled={saved}
                className="w-full rounded border border-border bg-bg py-2 text-sm font-medium hover:bg-surface disabled:opacity-50"
              >
                {saved ? "Evaluation Saved" : "Save Evaluation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}