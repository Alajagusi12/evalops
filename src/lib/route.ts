import { NextResponse } from "next/server";

export function bad(msg: string, status = 400): never {
  throw Object.assign(new Error(msg), { status });
}

/** Wraps an API handler: JSON in, JSON out, consistent error shape. */
export function route<T>(fn: (req: Request) => Promise<T>) {
  return async (req: Request) => {
    try {
      return NextResponse.json(await fn(req));
    } catch (e: any) {
      console.error("[api]", e);
      return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: e?.status ?? 500 });
    }
  };
}
