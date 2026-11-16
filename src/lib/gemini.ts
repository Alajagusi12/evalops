const BASE = "https://generativelanguage.googleapis.com/v1beta";

// Only use models that work with the AQ key
export const DEFAULT_MODELS = ["gemini-flash-latest"];

const CALL_TIMEOUT_MS = 45000; // Increased from 25s
const TOTAL_BUDGET_MS = 60000;
const LIST_TIMEOUT_MS = 10000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function apiKey() {
  const k = process.env.GEMINI_API_KEY;
  if (!k) {
    throw Object.assign(
      new Error("GEMINI_API_KEY is missing. Add it to .env locally or to your Vercel environment variables."),
      { status: 500 },
    );
  }
  return k;
}

const isTimeout = (e: any) => e?.name === "TimeoutError" || e?.name === "AbortError";

export type GenOpts = {
  model?: string;
  system?: string;
  json?: boolean;
  temperature?: number;
  strict?: boolean;
};
export type GenResult = { text: string; model: string; latencyMs: number };

async function callModel(model: string, prompt: string, o: GenOpts): Promise<Response> {
  const generationConfig: any = {
    temperature: o.temperature ?? 0.7,
    ...(o.json ? { responseMimeType: "application/json" } : {}),
  };
  
  const body: any = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig };
  if (o.system) body.systemInstruction = { parts: [{ text: o.system }] };

  // We ONLY try the specific model passed in, no fallback loops
  return await fetch(`${BASE}/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
  });
}

export async function generate(prompt: string, o: GenOpts = {}): Promise<GenResult> {
  const started = Date.now();
  
  // FORCE the model to be flash-latest to avoid any issues with retired models
  const model = "gemini-flash-latest";

  try {
    const r = await callModel(model, prompt, o);

    const raw = await r.text();
    let d: any = {};
    try { d = JSON.parse(raw); } catch {}

    if (!r.ok) {
      const msg: string = d?.error?.message ?? raw.slice(0, 200);
      if (r.status === 401 || r.status === 403) {
        throw new Error(`Gemini rejected the API key: ${msg}`);
      }
      throw new Error(`Gemini error (${r.status}): ${msg}`);
    }

    const block = d?.promptFeedback?.blockReason;
    if (block) throw new Error(`Gemini safety filters blocked this prompt (${block}).`);

    const text = (d?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? "").join("").trim();
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return { text, model, latencyMs: Date.now() - started };
  } catch (e: any) {
    if (isTimeout(e)) {
      throw new Error(`Gemini timed out after ${CALL_TIMEOUT_MS / 1000}s. The AQ key might be slow or under heavy load.`);
    }
    throw e;
  }
}

export function parseJson<T>(text: string): T {
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  throw new Error("Gemini returned invalid JSON. Please retry.");
}

export async function generateJson<T = any>(prompt: string, system: string, o: GenOpts = {}) {
  const opts = { ...o, system, json: true, temperature: o.temperature ?? 0.2 };
  let r = await generate(prompt, opts);
  try {
    return { data: parseJson<T>(r.text), model: r.model, latencyMs: r.latencyMs };
  } catch {
    r = await generate(prompt, opts);
    return { data: parseJson<T>(r.text), model: r.model, latencyMs: r.latencyMs };
  }
}