import { PageHeader, Card, Stat, ErrorBox, Empty } from "@/components/ui";
import { calibration } from "@/lib/stats";
export const dynamic = "force-dynamic";

export default async function CalibrationPage() {
  let c: Awaited<ReturnType<typeof calibration>>;
  try { c = await calibration(); } catch (e: any) { return <><PageHeader title="Human Calibration" /><ErrorBox msg={e.message} /></>; }
  return (
    <>
      <PageHeader title="Human Calibration" desc="How closely the AI judge agrees with human reviewers. Use Auto-Judge on the Evaluate page, adjust the scores, then save." />
      {c.m.n === 0 ? <Card><Empty text="No human-reviewed evaluations with an AI baseline yet." /></Card> : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Reviewed" value={c.m.n} />
            <Stat label="Within 1 point" value={`${c.m.agree}%`} hint="all four dimensions" />
            <Stat label="Mean abs. error" value={((c.m.fact + c.m.reason + c.m.safety + c.m.helpful) / 4).toFixed(2)} hint="AI vs human, 1-5 scale" />
            <Stat label="Largest gap" value={["fact", "reason", "safety", "helpful"].reduce((a, k) => (c.m[k] > c.m[a] ? k : a), "fact")} />
          </div>
          <Card title="Latest comparisons (human / AI)" className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-bg font-mono text-xs text-muted"><tr><th className="px-4 py-3 font-normal">Prompt</th>{["Fact", "Reason", "Safety", "Helpful"].map((h) => <th key={h} className="px-3 font-normal">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border font-mono">
                {c.rows.map((r: any) => (
                  <tr key={r.id}>
                    <td className="max-w-xs truncate px-4 py-3 font-sans">{r.prompt}</td>
                    {[[r.f, r.af], [r.r, r.ar], [r.s, r.as_], [r.h, r.ah]].map(([h, a], i) => <td key={i} className={`px-3 ${Math.abs(h - a) > 1 ? "text-warn" : ""}`}>{h} / {a}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}
