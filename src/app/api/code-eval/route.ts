import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are a senior security engineer. Review this code for security vulnerabilities and bugs. Return JSON with "vulnerabilities" (an array of strings) and "summary" (a string). Code: \n\n${code}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey || "" },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
    });

    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}