"use client";
import { useState } from "react";
import { Code2 } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox, Stat, inputCls } from "@/components/ui";
import { post } from "@/lib/api";

const SEV: Record<string, string> = { critical: "border-fail/40 bg-fail/10 text-fail", high: "border-fail/30 bg-fail/10 text-fail", medium: "border-warn/30 bg-warn/10 text-warn", low: "border-border bg-bg text-muted" };

export default function CodePage() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError(""); setRes(null);
    try { setRes(await post("/api/code", { code, language: lang })); } catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  return (
    <>
      <PageHeader title="Code Evaluation" desc="AI code review focused on bugs, security issues and maintainability." />
      <Card>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste code to review..." spellCheck={false} className={inputCls + " h-56 resize-y font-mono text-xs"} />
        <div className="mt-3 flex items-center justify-between gap-3">
          <input value={lang} onChange={(e) => setLang(e.target.value)} placeholder="Language (optional)" className="w-44 rounded border border-border bg-bg px-3 py-1.5 text-xs outline-none focus:border-pass" />
          <Button onClick={run} loading={loading} disabled={code.trim().length < 10}>{!loading && <Code2 className="h-4 w-4" />}{loading ? "Reviewing..." : "Review Code"}</Button>
        </div>
      </Card>
      {error && <ErrorBox msg={error} />}
      {res && (
        <>
          <div className="grid gap-4 md:grid-cols-[200px_1fr]">
            <Stat label="Quality score" value={`${res.score}/10`} />
            <Card title="Summary"><p className="text-sm leading-relaxed">{res.summary}</p></Card>
          </div>
          <Card title={`Issues (${res.issues.length})`}>
            {res.issues.length === 0 ? <p className="text-sm text-pass">No issues found.</p> : (
              <ul className="space-y-3">
                {res.issues.map((i: any, n: number) => (
                  <li key={n} className="rounded border border-border bg-bg p-3">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 font-mono text-xs uppercase ${SEV[String(i.severity).toLowerCase()] ?? SEV.low}`}>{i.severity}</span>
                      <span className="text-sm font-medium">{i.title}</span>
                      {i.line && <span className="font-mono text-xs text-muted">line {String(i.line)}</span>}
                    </div>
                    <p className="text-xs text-muted">{i.fix}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </>
  );
}
