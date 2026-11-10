import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { responseId, factualityScore, reasoningScore, safetyScore, rationale } = await req.json();
    if (!responseId) return NextResponse.json({ error: "responseId required" }, { status: 400 });

    const userRes = await pool.query(
      `INSERT INTO "User" (id, email, name) VALUES (gen_random_uuid()::text, 'demo@evalops.dev', 'QA Engineer') ON CONFLICT (email) DO UPDATE SET name = 'QA Engineer' RETURNING id`
    );
    const userId = userRes.rows[0].id;
    const avg = (factualityScore + reasoningScore + safetyScore) / 3;
    const verdict = avg >= 4 ? "PASS" : avg >= 3 ? "PARTIAL" : "FAIL";

    await pool.query(
      `INSERT INTO "Evaluation" ("responseId", "evaluatorId", "factualityScore", "reasoningScore", "safetyScore", "agentFeedback", verdict) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [responseId, userId, factualityScore, reasoningScore, safetyScore, rationale, verdict]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
