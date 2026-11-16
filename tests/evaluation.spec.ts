import { test, expect } from "@playwright/test";

test.describe("EvalOps core flows", () => {
  test("user can submit a prompt and see the AI response", async ({ page }) => {
    await page.route("**/api/models", (r) => r.fulfill({ json: { models: ["gemini-2.5-flash"] } }));
    await page.route("**/api/generate", (r) =>
      r.fulfill({ json: { runId: "mock-run", responseText: "Paris is the capital of France.", latencyMs: 1200, modelName: "gemini-mock" } }),
    );
    await page.goto("/evaluate");
    await page.getByPlaceholder("Enter a prompt to test the AI...").fill("What is the capital of France?");
    await page.getByRole("button", { name: /Run Evaluation/i }).click();
    await expect(page.getByText("Paris is the capital of France.")).toBeVisible();
    await expect(page.getByRole("button", { name: /Auto-Judge/i })).toBeVisible();
  });

  test("auto-judge fills scores and enables saving", async ({ page }) => {
    await page.route("**/api/models", (r) => r.fulfill({ json: { models: ["gemini-2.5-flash"] } }));
    await page.route("**/api/generate", (r) => r.fulfill({ json: { runId: "r1", responseText: "42", latencyMs: 300, modelName: "gemini-mock" } }));
    await page.route("**/api/judge", (r) => r.fulfill({ json: { fact: 5, reason: 4, safety: 5, helpful: 4, rationale: "Accurate and concise answer." } }));
    await page.route("**/api/evaluate", (r) => r.fulfill({ json: { success: true } }));
    await page.goto("/evaluate");
    await page.getByPlaceholder("Enter a prompt to test the AI...").fill("Answer to everything?");
    await page.getByRole("button", { name: /Run Evaluation/i }).click();
    await page.getByRole("button", { name: /Auto-Judge/i }).click();
    await expect(page.getByPlaceholder(/Why did you score it/)).toHaveValue("Accurate and concise answer.");
    await page.getByRole("button", { name: /Save Evaluation/i }).click();
    await expect(page.getByRole("button", { name: /Evaluation saved/i })).toBeVisible();
  });

  test("API errors are shown to the user", async ({ page }) => {
    await page.route("**/api/models", (r) => r.fulfill({ json: { models: ["gemini-2.5-flash"] } }));
    await page.route("**/api/generate", (r) => r.fulfill({ status: 500, json: { error: "Gemini failed. test error" } }));
    await page.goto("/evaluate");
    await page.getByPlaceholder("Enter a prompt to test the AI...").fill("hello there");
    await page.getByRole("button", { name: /Run Evaluation/i }).click();
    await expect(page.getByText("Gemini failed. test error")).toBeVisible();
  });
});
