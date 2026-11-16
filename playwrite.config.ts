import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000', // Using 127.0.0.1 instead of localhost fixes Windows routing issues
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true, // If your app is already running, it will just use it
  },
});