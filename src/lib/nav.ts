import { LayoutDashboard, FilePlus2, GitCompare, Layers, RotateCcw, Code2, Sparkles, History, Users, FileText, Activity, Settings, type LucideIcon } from "lucide-react";
export type NavItem = { label: string; href: string; icon: LucideIcon };
export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Evaluation", href: "/evaluate", icon: FilePlus2 },
  { label: "Model Comparison", href: "/compare", icon: GitCompare },
  { label: "Dataset Evaluation", href: "/batch", icon: Layers },
  { label: "Regression Testing", href: "/regression", icon: RotateCcw },
  { label: "Code Evaluation", href: "/code", icon: Code2 },
  { label: "Prompt Analyzer", href: "/prompt-analyzer", icon: Sparkles },
  { label: "Evaluation History", href: "/history", icon: History },
  { label: "Human Calibration", href: "/calibration", icon: Users },
  { label: "AI Monitoring", href: "/monitoring", icon: Activity },
  { label: "Reports", href: "/reports", icon: FileText },
];
export const secondaryNav: NavItem[] = [{ label: "Settings", href: "/settings", icon: Settings }];
