import { test, expect } from '@playwright/test';

test.describe('Evaleu Site E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should show leaderboard section', async ({ page }) => {
    // Check that leaderboard content is visible
    const leaderboard = page.locator('.leaderboard');
    await expect(leaderboard).toBeVisible();
  });

  test('should show comparison tool section', async ({ page }) => {
    const compTool = page.locator('.comparison-tool');
    await expect(compTool).toBeVisible();
  });

  test('should have score bars visible', async ({ page }) => {
    const scoreBars = page.locator('.score-bar');
    await expect(scoreBars.first()).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find and click the theme toggle button
    const toggle = page.locator('[data-theme-toggle]');
    if (await toggle.count() > 0) {
      await toggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      
      // Toggle back
      await toggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    }
  });

  test('should have responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Page should still be visible and not overflow horizontally
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // small tolerance for rounding
  });

  test('should have responsive layout on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have responsive layout on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have footer content', async ({ page }) => {
    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });

  test('page should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    // Small wait for any async errors
    await page.waitForTimeout(1000);
    
    expect(errors).toHaveLength(0);
  });

  test('should have valid HTML structure', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
  });
});
