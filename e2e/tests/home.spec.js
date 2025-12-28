const { test, expect } = require('@playwright/test');

test('home page loads and contains app root', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ORISH53/);
  await expect(page.locator('#root')).toHaveCount(1);
});
