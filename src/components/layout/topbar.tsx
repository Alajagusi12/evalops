"use client";

import { Menu, ChevronRight, Activity } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 border-b border-border flex items-center px-4 lg:px-8 bg-bg/80 backdrop-blur sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden mr-4 text-muted hover:text-fg">
        <Menu className="h-5 w-5" />
      </button>
      
      <nav className="flex items-center gap-2 text-sm text-muted">
        <span className="font-mono text-xs hidden sm:inline">evalops</span>
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3" />
            <span className={i === segments.length - 1 ? "text-fg capitalize font-medium" : "capitalize"}>
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
  );
}