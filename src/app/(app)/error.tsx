"use client";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
      <div className="p-4 rounded-full bg-fail/10 border border-fail/20">
        <AlertCircle className="h-8 w-8 text-fail" />
      </div>
      <h2 className="text-xl font-bold text-fg">Something went wrong</h2>
      <p className="text-sm text-muted max-w-md">An unexpected error occurred in the evaluation engine. Our agents have logged the issue.</p>
      <button onClick={() => reset()} className="mt-4 flex items-center gap-2 rounded border border-border bg-surface px-4 py-2 text-sm hover:bg-bg">
        <RefreshCcw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}