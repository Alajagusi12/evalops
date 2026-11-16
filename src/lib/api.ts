async function parse<T>(r: Response): Promise<T> {
  const d = await r.json().catch(() => ({}));
  if (!r.ok || (d as any).error) throw new Error((d as any).error || `Request failed (${r.status})`);
  return d as T;
}
export async function post<T = any>(url: string, body: unknown = {}): Promise<T> {
  return parse<T>(await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
}
export async function get<T = any>(url: string): Promise<T> {
  return parse<T>(await fetch(url, { cache: "no-store" }));
}
