import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      const errorData = await res.text();
      console.error("❌ GEMINI API REJECTED:", errorData);
      return NextResponse.json({ error: "Gemini rejected the request. Check terminal." }, { status: 500 });
    }

    const data = await res.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      console.error("❌ GEMINI RETURNED BAD DATA:", data);
      return NextResponse.json({ error: "Gemini did not return a valid text response." }, { status: 500 });
    }

    const text = data.candidates[0].content.parts[0].text;
    const latencyMs = Date.now() - started;

    const prompt = await prisma.prompt.create({ data: { text: promptText } });
    const response = await prisma.modelResponse.create({
      data: { promptId: prompt.id, responseText: text, latencyMs, modelName: model },
    });

    return NextResponse.json({
      promptId: prompt.id, responseId: response.id, responseText: text, latencyMs, modelName: model
    });

  } catch (error: any) {
    console.error("❌ GENERATE ROUTE CRASH:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}