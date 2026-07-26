import { defineConfig, devices } from '@playwright/test';

const externalUrl = process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, '');
const requestedPort = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? '4322', 10);
const port = Number.isFinite(requestedPort) ? requestedPort : 4322;
const localUrl = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalUrl ?? localUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: externalUrl ? undefined : {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: `${localUrl}/pagefind/pagefind.js`,
    timeout: 180_000,
    reuseExistingServer: false
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'firefox', grep: /@smoke/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', grep: /@smoke/, use: { ...devices['Desktop Safari'] } }
  ]
});
