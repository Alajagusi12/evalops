"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Menu, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)}>
          <div className="w-60 h-full bg-bg" onClick={e => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-60 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 lg:px-6 backdrop-blur">
          <button onClick={() => setIsMobileOpen(true)} className="lg:hidden text-muted hover:text-fg">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="flex items-center gap-1.5 text-sm">
            <span className="font-mono text-xs text-muted hidden sm:inline">evalops</span>
            {segments.map((seg, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-muted" />
                <span className={i === segments.length - 1 ? "text-fg capitalize font-medium" : "text-muted capitalize"}>
                  {seg.replace(/-/g, " ")}
                </span>
              </span>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-pass animate-pulse" />
            <span className="font-mono text-muted hidden sm:inline">Agents Online</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}