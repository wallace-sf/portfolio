import { test, expect } from '@playwright/test';

test('deve renderizar a home corretamente no WebKit', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();
});
