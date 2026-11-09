import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { responseId, factualityScore, reasoningScore, safetyScore, rationale } = await req.json();

    if (!responseId) {
      return NextResponse.json({ error: "responseId is required" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: "demo@evalops.dev" },
      update: {},
      create: { email: "demo@evalops.dev", name: "QA Engineer" },
    });

    const avg = (factualityScore + reasoningScore + safetyScore) / 3;
    const verdict = avg >= 4 ? "PASS" : avg >= 3 ? "PARTIAL" : "FAIL";

    const evaluation = await prisma.evaluation.create({
      data: {
        responseId,
        evaluatorId: user.id,
        factualityScore,
        reasoningScore,
        safetyScore,
        agentFeedback: rationale,
        verdict,
      },
    });

    return NextResponse.json({ success: true, evaluation });
  } catch (error: any) {
    console.error("❌ EVALUATE API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}