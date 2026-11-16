import * as React from "react";
import { Loader2, AlertTriangle, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, right, className, children }: { title?: string; right?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface", className)}>
      {(title || right) && (
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{title}</h3>
          {right}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Button({ loading, variant = "primary", className, children, disabled, ...p }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: "primary" | "ghost" }) {
  return (
    <button
      {...p}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" ? "border-pass/30 bg-pass/10 text-pass hover:bg-pass/20" : "border-border bg-raised text-fg hover:bg-border/60",
        className,
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function VerdictBadge({ v }: { v: string }) {
  const cls = v === "PASS" ? "border-pass/30 bg-pass/10 text-pass" : v === "FAIL" ? "border-fail/30 bg-fail/10 text-fail" : "border-warn/30 bg-warn/10 text-warn";
  const Icon = v === "PASS" ? CheckCircle2 : v === "FAIL" ? XCircle : AlertCircle;
  return <span className={cn("inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs", cls)}><Icon className="h-3 w-3" />{v}</span>;
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-fail/30 bg-fail/10 p-3 text-sm text-fail">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-words">{msg}</span>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-muted">{text}</p>;
}

export const inputCls = "w-full rounded border border-border bg-bg p-3 text-sm outline-none focus:border-pass";
