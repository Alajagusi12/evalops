import { test, expect } from '@playwright/test';

test.describe('EvalOps Core Flow', () => {
  test('User can submit a prompt and see the AI response (Mocked)', async ({ page }) => {
    await page.route('**/api/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          promptId: 'mock-prompt-123',
          responseId: 'mock-response-123',
          responseText: 'Paris is the capital of France.',
          latencyMs: 1200,
          modelName: 'mock-model'
        })
      });
    });

    await page.goto('http://127.0.0.1:3000/evaluate');
    await page.getByPlaceholder('Enter a prompt to test the AI...').fill('What is the capital of France?');
    await page.getByRole('button', { name: /Run Evaluation/i }).click();

    await expect(page.getByText('AI RESPONSE')).toBeVisible();
    await expect(page.getByText('Paris is the capital of France.')).toBeVisible();
  });
});