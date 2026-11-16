"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const segments = (usePathname() ?? "").split("/").filter(Boolean);
  return (
    <div className="flex min-h-screen bg-bg">
      {open && (
        <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
          <div className="relative h-full w-60" onClick={(e) => e.stopPropagation()}>
            <Sidebar onNavigate={() => setOpen(false)} />
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-[-40px] top-3 text-muted"><X className="h-5 w-5" /></button>
          </div>
        </div>
      )}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block"><Sidebar /></div>
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur lg:px-6">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="text-muted hover:text-fg lg:hidden"><Menu className="h-5 w-5" /></button>
          <nav className="flex items-center gap-1.5 text-sm">
            <span className="hidden font-mono text-xs text-muted sm:inline">evalops</span>
            {segments.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-muted" />
                <span className={i === segments.length - 1 ? "font-medium capitalize" : "capitalize text-muted"}>{s.replace(/-/g, " ")}</span>
              </span>
            ))}
          </nav>
          
        </header>
        <main className="flex-1 overflow-x-hidden p-4 lg:p-8"><div className="mx-auto max-w-6xl space-y-6">{children}</div></main>
      </div>
    </div>
  );
}
