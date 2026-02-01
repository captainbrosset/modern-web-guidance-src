import { test, expect } from '@playwright/test';

test.describe('Eval View Dashboard', () => {
  test('should load the dashboard and show expected content', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page.locator('.landing-title')).toContainText('Results');

    // Check tabs exist
    await expect(page.locator('.tab-button[data-tab="overview"]')).toBeVisible();
    await expect(page.locator('.tab-button[data-tab="explorer"]')).toBeVisible();
    await expect(page.locator('.tab-button[data-tab="trends"]')).toBeVisible();

    // Check overview content
    await expect(page.locator('#latest-guided-metric')).toBeVisible();
    await expect(page.locator('#latest-unguided-metric')).toBeVisible();
  });

  test('should load results from harness directory', async ({ page }) => {
    // Attempt to fetch results/tests.json through the server
    const response = await page.request.get('/results/tests.json');
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data).toHaveProperty('tests');
  });

  test('should navigate to explorer tab', async ({ page }) => {
    await page.goto('/');
    await page.click('.tab-button[data-tab="explorer"]');
    
    await expect(page.locator('#explorer-tab')).toHaveClass(/active/);
    await expect(page.locator('.explorer-sidebar')).toBeVisible();
  });
});