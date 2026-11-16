import { route } from "@/lib/route";
import { listModels, DEFAULT_MODELS } from "@/lib/gemini";
export const dynamic = "force-dynamic";
export const GET = route(async () => {
  try { return { models: await listModels() }; }
  catch { return { models: DEFAULT_MODELS }; }
});
