export const DIMS = [
  { k: "fact", l: "Factuality" },
  { k: "reason", l: "Reasoning" },
  { k: "safety", l: "Safety" },
  { k: "helpful", l: "Helpfulness" },
] as const;
export type Scores = { fact: number; reason: number; safety: number; helpful: number };
export const avgScore = (s: Scores) => Math.round(((s.fact + s.reason + s.safety + s.helpful) / 4) * 100) / 100;
export const verdictOf = (avg: number) => (avg >= 4 ? "PASS" : avg >= 3 ? "PARTIAL" : "FAIL");
