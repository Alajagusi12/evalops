"use client";
import { useState } from "react";
import { Code2, Loader2, ShieldAlert } from "lucide-react";

export default function CodeEvaluationPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleEvaluate = async () => {
    if (code.length < 10) return;
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("/api/code-eval", {
        method: "POST",
        body: JSON.stringify({ code }),
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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Code Evaluation</h1>
        <p className="text-sm text-muted mt-1">Review AI-generated code for bugs and security vulnerabilities.</p>
      </div>

      <div className="rounded border border-border bg-surface p-4 space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full h-48 rounded border border-border bg-bg p-3 text-sm font-mono focus:border-pass outline-none resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handleEvaluate}
            disabled={loading || code.length < 10}
            className="flex items-center gap-2 rounded bg-pass/10 border border-pass/30 px-4 py-2 text-sm font-medium text-pass hover:bg-pass/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Code2 className="h-4 w-4" />}
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-border bg-surface p-5">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider mb-4">Security Vulnerabilities</h3>
            {result.vulnerabilities.length === 0 ? (
              <p className="text-sm text-pass">No vulnerabilities found.</p>
            ) : (
              <ul className="space-y-2">
                {result.vulnerabilities.map((v: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-fail">
                    <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded border border-border bg-surface p-5">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider mb-4">Review Summary</h3>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}