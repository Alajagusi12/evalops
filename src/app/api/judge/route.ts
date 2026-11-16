import { route, bad } from "@/lib/route";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
import { judge } from "@/lib/judge";
export const POST = route(async (req) => {
  const { promptText, responseText } = await req.json();
  if (!promptText || !responseText) bad("promptText and responseText are required.");
  return await judge(promptText, responseText);
});
