"use client";
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { PageHeader, Card, Button, ErrorBox } from "@/components/ui";
import { ModelSelect, useModels } from "@/components/model-select";
import { get } from "@/lib/api";

export default function SettingsPage() {
  const models = useModels();
  const [loading, setLoading] = useState(false);
  const [h, setH] = useState<any>(null);
  const [error, setError] = useState("");
  async function check() {
    setLoading(true); setError(""); setH(null);
    try { setH(await get("/api/health")); } catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  const row = (label: string, v: string) => (
    <div className="flex items-start justify-between gap-4 py-2 text-sm"><span className="text-muted">{label}</span><span className={`break-words text-right font-mono text-xs ${v === "ok" ? "text-pass" : "text-fail"}`}>{v}</span></div>
  );
  return (
    <>
      <PageHeader title="Settings" desc="Check that your database and Gemini key work." />
      <Card title="System health" right={<Button onClick={check} loading={loading} className="px-3 py-1 text-xs">{!loading && <HeartPulse className="h-3 w-3" />}Run check</Button>}>
        {!h && !error && <p className="text-sm text-muted">Click “Run check” to test the database connection and make a live Gemini call.</p>}
        {error && <ErrorBox msg={error} />}
        {h && <div className="divide-y divide-border">{row("Database", h.db)}{row("Gemini", h.gemini)}{h.model && row("Model in use", h.model)}{h.latencyMs && row("Latency", `${h.latencyMs}ms`)}</div>}
      </Card>
      <Card title="Models available to your key">
        <div className="flex flex-wrap gap-2">{models.map((m) => <span key={m} className="rounded border border-border bg-bg px-2 py-1 font-mono text-xs">{m}</span>)}</div>
        <p className="mt-3 text-xs text-muted">Set GEMINI_MODEL in your environment to pin a model. Leave it empty and EvalOps picks a working one automatically.</p>
      </Card>
    </>
  );
}
