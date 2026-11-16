"use client";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";

export function useModels() {
  const [models, setModels] = useState<string[]>([]);
  useEffect(() => {
    get<{ models: string[] }>("/api/models").then((d) => setModels(d.models)).catch(() => setModels(["gemini-2.5-flash", "gemini-flash-latest"]));
  }, []);
  return models;
}

export function ModelSelect({ models, value, onChange, auto = false, label }: { models: string[]; value: string; onChange: (v: string) => void; auto?: boolean; label?: string }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded border border-border bg-bg px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-pass">
        {auto && <option value="">Auto (best available)</option>}
        {models.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
    </label>
  );
}
