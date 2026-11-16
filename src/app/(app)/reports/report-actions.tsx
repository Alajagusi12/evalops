"use client";
import { useState } from "react";
import { Printer, Sparkles } from "lucide-react";
import { Button, Card, ErrorBox } from "@/components/ui";
import { post } from "@/lib/api";

export function ReportActions() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function gen() {
    setLoading(true); setError("");
    try { setSummary((await post("/api/report")).summary); } catch (e: any) { setError(e.message); }
    setLoading(false);
  }
  return (
    <div className="space-y-4">
      <div className="no-print flex gap-3">
        <Button onClick={gen} loading={loading}>{!loading && <Sparkles className="h-4 w-4" />}AI executive summary</Button>
        <Button variant="ghost" onClick={() => window.print()}><Printer className="h-4 w-4" />Print / save PDF</Button>
      </div>
      {error && <ErrorBox msg={error} />}
      {summary && <Card title="Executive summary"><p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p></Card>}
    </div>
  );
}
