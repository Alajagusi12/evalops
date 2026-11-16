import { UploadCloud, FileJson, Play } from "lucide-react";

export default function DatasetsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dataset Evaluation</h1>
        <p className="text-sm text-muted mt-1">Run batch evaluations on uploaded JSON or CSV datasets.</p>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center bg-surface/50">
        <UploadCloud className="h-10 w-10 text-muted mb-4" />
        <h3 className="text-sm font-medium">Click to upload or drag and drop</h3>
        <p className="text-xs text-muted mt-1">Supports .csv, .json, and .jsonl (max 50MB)</p>
        <button className="mt-4 rounded border border-border bg-bg px-4 py-2 text-sm hover:bg-surface">Select File</button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-mono uppercase text-muted">Recent Datasets</h3>
        {["factuality_test_set.csv", "safety_prompts_v2.jsonl"].map((file) => (
          <div key={file} className="p-4 rounded border border-border bg-surface flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileJson className="h-5 w-5 text-pass" />
              <span className="text-sm font-mono">{file}</span>
            </div>
            <button className="flex items-center gap-2 text-xs border border-border rounded px-3 py-1.5 hover:bg-bg">
              <Play className="h-3 w-3" /> Run Batch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}