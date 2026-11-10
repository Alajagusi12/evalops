import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const promptText = body.promptText;
    const model = "gemini-flash-latest"; 

    if (!promptText) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in .env" }, { status: 500 });
    }

    const started = Date.now();
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Gemini rejected the request." }, { status: 500 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    const latencyMs = Date.now() - started;

    const promptRes = await pool.query(
      `INSERT INTO "Prompt" (text) VALUES ($1) RETURNING id`,
      [promptText]
    );
    const promptId = promptRes.rows[0].id;

    const responseRes = await pool.query(
      `INSERT INTO "ModelResponse" ("promptId", "responseText", "latencyMs", "modelName") 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [promptId, text, latencyMs, model]
    );
    const responseId = responseRes.rows[0].id;

    return NextResponse.json({
      promptId, responseId, responseText: text, latencyMs, modelName: model
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
