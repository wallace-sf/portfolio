import { test, expect } from '@playwright/test';

test('should render the home page correctly in WebKit', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();
});
