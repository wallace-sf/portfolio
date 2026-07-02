import { defineConfig, devices } from '@playwright/test';
import { screens } from '@repo/tailwind-config/screens';

const VIEWPORT_HEIGHT = 900;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'] } },
    ...Object.entries(screens).map(([name, width]) => ({
      name: `webkit-${name}`,
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: parseInt(width, 10), height: VIEWPORT_HEIGHT },
      },
    })),
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
