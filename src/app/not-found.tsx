import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-fg text-center p-6">
      <SearchX className="h-12 w-12 text-muted mb-4" />
      <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted mb-6">The evaluation route you are looking for does not exist.</p>
      <Link href="/dashboard" className="rounded bg-pass/10 border border-pass/30 px-6 py-2 text-sm font-medium text-pass hover:bg-pass/20">
        Return to Command Centre
      </Link>
    </div>
  );
}