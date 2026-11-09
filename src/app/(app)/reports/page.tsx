import { FileText, Download } from "lucide-react";

const reports = [
  { id: "REP-104", name: "Weekly Hallucination Audit", date: "2 hours ago", status: "Ready" },
  { id: "REP-103", name: "Gemini 1.5 Pro vs Flash Benchmark", date: "Yesterday", status: "Ready" },
  { id: "REP-102", name: "Safety Regression Test", date: "2 days ago", status: "Ready" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Generated Reports</h1>
        <p className="text-sm text-muted mt-1">Download detailed evaluation audits.</p>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="p-4 rounded border border-border bg-surface flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded bg-bg border border-border">
                <FileText className="h-5 w-5 text-pass" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{report.name}</h3>
                <p className="text-xs text-muted font-mono mt-0.5">{report.id} • {report.date}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded hover:bg-bg transition-colors">
              <Download className="h-3.5 w-3.5" /> Download CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}