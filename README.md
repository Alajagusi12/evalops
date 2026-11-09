# EvalOps — Autonomous AI Quality Engineering Platform

EvalOps is a full-stack, production-style AI evaluation platform designed to test, score, and benchmark LLM outputs. It features an enterprise-grade dark UI, real-time AI agent evaluation, and automated end-to-end testing.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Enterprise Design System)
- **Database:** PostgreSQL (Neon.tech) + Prisma ORM
- **AI Integration:** Google Gemini API (`gemini-flash-latest`)
- **Charts:** Recharts
- **Automated Testing:** Playwright (E2E + Network Mocking)
- **Icons:** Lucide-React

## 🧠 Core Features

1. **Multi-Agent Evaluation Engine:** Submit a prompt to the AI and score the response across Factuality, Reasoning, and Safety metrics.
2. **Real-time Metrics Dashboard:** View pass rates, hallucination rates, and agent activity using Recharts.
3. **Evaluation History:** A full data table of past evaluations, verdicts, and timestamps pulled directly from PostgreSQL.
4. **Model Comparison:** Run side-by-side tests for different AI models.
5. **Prompt Analyzer & Code Eval:** Specialized tools to analyze user prompts and review AI-generated code for security vulnerabilities.
6. **Automated E2E Tests:** Playwright tests that use network interception to validate the UI quickly and reliably.

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/evalops.git
cd evalops