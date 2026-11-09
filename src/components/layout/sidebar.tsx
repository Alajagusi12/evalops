"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, FilePlus2, GitCompare, Library, RotateCcw,
  Code2, Database, Users, History, FileText, Activity, Sparkles, Settings, ActivityIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Agents", href: "/agents", icon: Bot },
  { label: "New Evaluation", href: "/evaluate", icon: FilePlus2 },
  { label: "Model Comparison", href: "/compare", icon: GitCompare },
  { label: "Benchmark Lab", href: "/benchmarks", icon: Library },
  { label: "Regression Testing", href: "/regression", icon: RotateCcw },
  { label: "Code Evaluation", href: "/code", icon: Code2 },
  { label: "Dataset Evaluation", href: "/datasets", icon: Database },
  { label: "Human Calibration", href: "/calibration", icon: Users },
  { label: "Evaluation History", href: "/history", icon: History },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "AI Monitoring", href: "/monitoring", icon: Activity },
  { label: "Prompt Analyzer", href: "/prompt-analyzer", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 w-60 border-r border-border bg-bg flex flex-col z-40 hidden lg:flex">
      <div className="h-14 flex items-center gap-2 px-6 border-b border-border">
        <ActivityIcon className="h-5 w-5 text-pass" />
        <span className="font-semibold tracking-tight text-sm">EvalOps</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors border border-transparent",
                active ? "bg-surface text-fg border-border" : "text-muted hover:text-fg hover:bg-surface/50"
              )}>
              <Icon className={cn("h-4 w-4", active ? "text-pass" : "")} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-muted hover:text-fg border border-transparent">
          <Settings className="h-4 w-4" strokeWidth={1.75} /> Settings
        </Link>
      </div>
    </aside>
  );
}