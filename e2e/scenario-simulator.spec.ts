import { test, expect } from '@playwright/test';

test.describe('Scenario Simulator Component', () => {
  test('Mounts and accepts input', async ({ page }) => {
    // Navigate to the main application
    await page.goto('/');

    // Expect the AI Scenario Simulator section to be visible
    await expect(page.locator('text=AI Scenario Simulator')).toBeVisible();

    // Verify Run Simulation button is present
    const runBtn = page.locator('button:has-text("Run Simulation")');
    await expect(runBtn).toBeVisible();
    
    // Fill out the risk assessment forms to unlock the button
    await page.fill('input[placeholder="e.g. Miami Beach Base"]', 'New York Seaport');

    // We expect the button to become enabled
    await expect(runBtn).toBeEnabled();
  });
});
