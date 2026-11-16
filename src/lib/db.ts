import { Pool } from "pg";
import { type Scores, avgScore, verdictOf } from "./scoring";

const g = globalThis as unknown as { pool?: Pool; schema?: Promise<void> };

export const pool =
  g.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
    idleTimeoutMillis: 30000,
  });
pool.on("error", (e) => console.error("[pg] idle client error", e.message));
if (process.env.NODE_ENV !== "production") g.pool = pool;

/** Creates tables on first use, so no manual migration is needed. */
export function ensureSchema(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    return Promise.reject(new Error("DATABASE_URL is missing. Add your Neon connection string to .env."));
  }
  if (!g.schema) {
    g.schema = pool
      .query(`
        create table if not exists eo_runs (
          id text primary key default gen_random_uuid()::text,
          kind text not null default 'generate',
          prompt text not null, response text, model text, latency_ms int, meta jsonb,
          created_at timestamptz not null default now());
        create table if not exists eo_evaluations (
          id text primary key default gen_random_uuid()::text,
          run_id text references eo_runs(id) on delete cascade,
          factuality int not null, reasoning int not null, safety int not null, helpfulness int not null default 3,
          verdict text not null, rationale text, source text not null default 'human',
          ai_factuality int, ai_reasoning int, ai_safety int, ai_helpfulness int,
          created_at timestamptz not null default now());
        create index if not exists eo_runs_created on eo_runs(created_at desc);
        create index if not exists eo_eval_created on eo_evaluations(created_at desc);
      `)
      .then(() => undefined)
      .catch((e) => {
        g.schema = undefined; // allow retry on next request
        throw new Error(`Database connection failed: ${e.message}`);
      });
  }
  return g.schema;
}

export async function saveRun(r: { kind: string; prompt: string; response?: string; model?: string; latencyMs?: number; meta?: object }) {
  await ensureSchema();
  const q = await pool.query(
    `insert into eo_runs (kind, prompt, response, model, latency_ms, meta) values ($1,$2,$3,$4,$5,$6::jsonb) returning id`,
    [r.kind, r.prompt, r.response ?? null, r.model ?? null, r.latencyMs ?? null, JSON.stringify(r.meta ?? {})],
  );
  return q.rows[0].id as string;
}

export async function saveEval(e: { runId: string; scores: Scores; rationale?: string; source: "human" | "ai"; ai?: Scores | null }) {
  await ensureSchema();
  const avg = avgScore(e.scores);
  const verdict = verdictOf(avg);
  await pool.query(
    `insert into eo_evaluations (run_id, factuality, reasoning, safety, helpfulness, verdict, rationale, source, ai_factuality, ai_reasoning, ai_safety, ai_helpfulness)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [e.runId, e.scores.fact, e.scores.reason, e.scores.safety, e.scores.helpful, verdict, e.rationale ?? null, e.source,
      e.ai?.fact ?? null, e.ai?.reason ?? null, e.ai?.safety ?? null, e.ai?.helpful ?? null],
  );
  return { avg, verdict };
}