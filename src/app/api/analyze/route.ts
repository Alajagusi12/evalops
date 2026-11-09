import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { promptText } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    const systemPrompt = `You are a Prompt Quality Analyzer. Analyze the following prompt and return a JSON object with a "clarityScore" (1-10) and "feedback" (a brief explanation of how to improve it). Prompt: "${promptText}"`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
    });

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const data = await res.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Clean up markdown formatting if Gemini returns it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(text);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to analyze prompt. The AI might be busy." }, { status: 500 });
  }
}