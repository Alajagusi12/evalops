import { Client } from "pg";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  // Raw SQL query to get the data we need
  const res = await client.query(`
    SELECT 
      e.id as evaluation_id,
      p.text as prompt_text,
      e.verdict,
      e."factualityScore",
      e."reasoningScore",
      e."safetyScore",
      e."createdAt"
    FROM "Evaluation" e
    JOIN "ModelResponse" r ON e."responseId" = r.id
    JOIN "Prompt" p ON r."promptId" = p.id
    ORDER BY e."createdAt" DESC
    LIMIT 50;
  `);

  await client.end();
  const evaluations = res.rows;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evaluation History</h1>
        <p className="text-sm text-muted mt-1">Recent evaluations processed by the agent swarm.</p>
      </div>

      <div className="border border-border rounded bg-surface overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-bg border-b border-border text-xs font-mono text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Prompt</th>
              <th className="px-4 py-3 font-normal">Verdict</th>
              <th className="px-4 py-3 font-normal">Score</th>
              <th className="px-4 py-3 font-normal">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {evaluations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No evaluations found.
                </td>
              </tr>
            ) : (
              evaluations.map((ev: any) => {
                const avg = ((ev.factualityScore + ev.reasoningScore + ev.safetyScore) / 3).toFixed(1);
                return (
                  <tr key={ev.evaluation_id} className="hover:bg-bg/50 transition-colors">
                    <td className="px-4 py-3 truncate max-w-xs">{ev.prompt_text}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono border ${
                        ev.verdict === "PASS" ? "bg-pass/10 text-pass border-pass/20" : 
                        ev.verdict === "FAIL" ? "bg-fail/10 text-fail border-fail/20" : 
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}>
                        {ev.verdict === "PASS" ? <CheckCircle2 className="h-3 w-3" /> : ev.verdict === "FAIL" ? <XCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {ev.verdict}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{avg}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}