# EvalOps

AI quality engineering platform: generate LLM responses with Gemini, score them with an AI judge, review as a human, compare models, regression-test prompts, and monitor quality over time.

![CI](https://github.com/Alajagusi12/evalops/actions/workflows/ci.yml/badge.svg)

## Features
- **New Evaluation**: generate, Auto-Judge (factuality, reasoning, safety, helpfulness), human override, save
- **Model Comparison**: same prompt on two Gemini models, judged side by side
- **Dataset Evaluation**: batch up to 8 prompts, pass rate, CSV export
- **Regression Testing**: re-run past prompts and see score changes
- **Code Evaluation** and **Prompt Analyzer**
- **Human Calibration**: AI judge vs human agreement
- **Monitoring**, **History** (search, filter, CSV), **Reports** (AI executive summary, print to PDF)
- Self-healing Gemini client: retries, model fallback and automatic model discovery

## Setup
```bash
npm install
cp .env.example .env   # add DATABASE_URL and GEMINI_API_KEY
npm run dev
```
Tables are created automatically on first use. Open **Settings → Run check** to verify the database and Gemini.

## Tests and Docker
```bash
npx playwright install chromium && npm test
docker build -t evalops . && docker run -p 3000:3000 --env-file .env evalops
```

## Deploy
Push to GitHub, import into Vercel, and set `DATABASE_URL` and `GEMINI_API_KEY` as environment variables.
