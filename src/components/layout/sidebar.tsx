"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const item = (n: (typeof primaryNav)[number]) => {
    const Icon = n.icon;
    const active = pathname === n.href;
    return (
      <Link key={n.href} href={n.href} onClick={onNavigate}
        className={cn("flex items-center gap-3 rounded border border-transparent px-3 py-2 text-sm transition-colors", active ? "border-border bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg")}>
        <Icon className={cn("h-4 w-4", active && "text-pass")} strokeWidth={1.75} />{n.label}
      </Link>
    );
  };
  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-bg">
      <div className="flex h-14 items-center gap-2 border-b border-border px-6">
        <Activity className="h-5 w-5 text-pass" /><span className="text-sm font-semibold tracking-tight">EvalOps</span>
        <span className="ml-auto rounded border border-border px-1.5 font-mono text-[10px] text-muted">v2</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">{primaryNav.map(item)}</nav>
      <div className="space-y-1 border-t border-border p-3">{secondaryNav.map(item)}</div>
    </aside>
  );
}
