# EvalOps — Autonomous AI Quality Engineering Platform

**Live Demo:** [https://evalops-eight.vercel.app](https://evalops-eight.vercel.app)

EvalOps is a production-grade AI evaluation platform designed to test, score, and benchmark LLM outputs. Built with a focus on Software QA principles, it features an AI Judge that automatically grades other AI models, an enterprise-grade dark UI, and a fully automated E2E testing suite.

## 🎯 The Problem It Solves
As AI models become more complex, ensuring their factual accuracy, reasoning, and safety is critical. EvalOps solves this by providing a centralized dashboard where QA engineers and AI researchers can benchmark models side-by-side, detect hallucinations, and maintain a historical record of evaluation rationales in a PostgreSQL database.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Enterprise Design System)
- **Database:** PostgreSQL (Neon.tech) via `pg` (Raw SQL for optimized performance)
- **AI Integration:** Google Gemini API (`gemini-flash-latest`)
- **Data Visualization:** Recharts
- **Automated Testing:** **Playwright (E2E with Network Mocking)**
- **Icons:** Lucide-React

## 🧠 Core Features

1. **AI Judge Engine:** Submit a prompt to the AI. Click "Auto-Judge" and a second AI agent evaluates the response on Factuality, Reasoning, and Safety, filling out the rubric automatically.
2. **Model Comparison Lab:** Run prompts against two models side-by-side and let the AI Judge declare a winner.
3. **AI Agents Command Centre:** A dashboard displaying the specialized evaluation agents (Accuracy, Hallucination, Safety, etc.) and their operational statuses.
4. **Evaluation History:** A dense data table pulling past evaluations, verdicts, and timestamps directly from PostgreSQL.
5. **Prompt Analyzer:** Uses Gemini to check a prompt for clarity, ambiguity, and logical conflicts before sending it to the model.
6. **Code Evaluation:** Paste code and have the AI review it for security vulnerabilities and syntax bugs.

## 🧪 QA & Test Automation (Core Focus)
Because this platform was built by a QA Engineer, it was developed with a "test-first" mindset. 
- **Playwright E2E Suite:** The repository includes a robust Playwright test suite (`/tests`) that validates the UI workflow, including network mocking to simulate API failures and ensure the app handles edge cases gracefully.
- **Database Integrity:** The raw SQL queries (using node-postgres) were tested to ensure data is inserted and retrieved without SQL injection vulnerabilities.

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/Alajagusi12/evalops.git
cd evalops
