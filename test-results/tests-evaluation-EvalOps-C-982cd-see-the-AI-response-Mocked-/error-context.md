# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\evaluation.spec.ts >> EvalOps Core Flow >> User can submit a prompt and see the AI response (Mocked)
- Location: tests\evaluation.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://127.0.0.1:3000/evaluate", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('EvalOps Core Flow', () => {
  4  |   test('User can submit a prompt and see the AI response (Mocked)', async ({ page }) => {
  5  |     await page.route('**/api/generate', async route => {
  6  |       await route.fulfill({
  7  |         status: 200,
  8  |         contentType: 'application/json',
  9  |         body: JSON.stringify({
  10 |           promptId: 'mock-prompt-123',
  11 |           responseId: 'mock-response-123',
  12 |           responseText: 'Paris is the capital of France.',
  13 |           latencyMs: 1200,
  14 |           modelName: 'mock-model'
  15 |         })
  16 |       });
  17 |     });
  18 | 
> 19 |     await page.goto('http://127.0.0.1:3000/evaluate');
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  20 |     await page.getByPlaceholder('Enter a prompt to test the AI...').fill('What is the capital of France?');
  21 |     await page.getByRole('button', { name: /Run Evaluation/i }).click();
  22 | 
  23 |     await expect(page.getByText('AI RESPONSE')).toBeVisible();
  24 |     await expect(page.getByText('Paris is the capital of France.')).toBeVisible();
  25 |   });
  26 | });
```