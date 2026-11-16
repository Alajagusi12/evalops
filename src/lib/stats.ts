import { pool, ensureSchema } from "./db";

const S = `(e.factuality+e.reasoning+e.safety+e.helpfulness)/4.0`;
const DAY = (col: string) => `to_char(date_trunc('day',${col}),'Mon DD')`;

export async function overview() {
  await ensureSchema();
  const [k, dist, trend, dims, recent] = await Promise.all([
    pool.query(`select count(*)::int total, coalesce(round(avg(${S}),2),0)::float avg_score,
      coalesce(round(100.0*avg((e.verdict='PASS')::int),1),0)::float pass_rate,
      coalesce(round(avg(r.latency_ms)),0)::int avg_latency
      from eo_evaluations e left join eo_runs r on r.id=e.run_id`),
    pool.query(`select verdict, count(*)::int n from eo_evaluations group by verdict`),
    pool.query(`select ${DAY("e.created_at")} as day, round(avg(${S}),2)::float as score, count(*)::int as n,
      round(100.0*avg((e.verdict='PASS')::int),0)::float as pass
      from eo_evaluations e where e.created_at > now() - interval '14 days'
      group by date_trunc('day',e.created_at) order by date_trunc('day',e.created_at)`),
    pool.query(`select coalesce(round(avg(factuality),2),0)::float fact, coalesce(round(avg(reasoning),2),0)::float reason,
      coalesce(round(avg(safety),2),0)::float safety, coalesce(round(avg(helpfulness),2),0)::float helpful from eo_evaluations`),
    pool.query(`select e.id, r.prompt, e.verdict, e.source, round(${S},1)::float score, e.created_at
      from eo_evaluations e join eo_runs r on r.id=e.run_id order by e.created_at desc limit 6`),
  ]);
  return { k: k.rows[0], dist: dist.rows, trend: trend.rows, dims: dims.rows[0], recent: recent.rows };
}

export async function monitoring() {
  await ensureSchema();
  const [latency, models] = await Promise.all([
    pool.query(`select ${DAY("created_at")} as day, round(avg(latency_ms))::int avg, round(percentile_cont(0.95) within group (order by latency_ms))::int p95, count(*)::int n
      from eo_runs where latency_ms is not null and created_at > now() - interval '14 days'
      group by date_trunc('day',created_at) order by date_trunc('day',created_at)`),
    pool.query(`select r.model, count(distinct r.id)::int runs, round(avg(r.latency_ms))::int latency,
      coalesce(round(avg(${S}),2),0)::float score, coalesce(round(100.0*avg((e.verdict='PASS')::int),0),0)::float pass
      from eo_runs r left join eo_evaluations e on e.run_id=r.id where r.model is not null group by r.model order by runs desc`),
  ]);
  return { latency: latency.rows, models: models.rows };
}

export async function calibration() {
  await ensureSchema();
  const where = `source='human' and ai_factuality is not null`;
  const [m, rows] = await Promise.all([
    pool.query(`select count(*)::int n,
      coalesce(round(avg(abs(factuality-ai_factuality)),2),0)::float fact, coalesce(round(avg(abs(reasoning-ai_reasoning)),2),0)::float reason,
      coalesce(round(avg(abs(safety-ai_safety)),2),0)::float safety, coalesce(round(avg(abs(helpfulness-ai_helpfulness)),2),0)::float helpful,
      coalesce(round(100.0*avg(((abs(factuality-ai_factuality)<=1) and (abs(reasoning-ai_reasoning)<=1) and (abs(safety-ai_safety)<=1) and (abs(helpfulness-ai_helpfulness)<=1))::int),0),0)::float agree
      from eo_evaluations where ${where}`),
    pool.query(`select e.id, r.prompt, e.factuality f, e.reasoning r, e.safety s, e.helpfulness h,
      e.ai_factuality af, e.ai_reasoning ar, e.ai_safety as_, e.ai_helpfulness ah, e.created_at
      from eo_evaluations e join eo_runs r on r.id=e.run_id where ${where.replace(/(source|ai_factuality)/g, "e.$1")} order by e.created_at desc limit 15`),
  ]);
  return { m: m.rows[0], rows: rows.rows };
}

export async function worst() {
  await ensureSchema();
  const q = await pool.query(`select r.prompt, round(${S},1)::float score, e.rationale from eo_evaluations e join eo_runs r on r.id=e.run_id
    where e.verdict='FAIL' order by e.created_at desc limit 5`);
  return q.rows;
}
