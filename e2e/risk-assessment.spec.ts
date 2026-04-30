import { test, expect } from '@playwright/test';

test.describe('Urban Resilience AI Reliability Sandbox', () => {
  test('Risk Assessment Tool mounts and is interactive', async ({ page }) => {
    // Navigate to the main application
    await page.goto('/');

    // Hero map chip (see HeroMap)
    await expect(page.getByText('Flood + heat stress')).toBeVisible();

    await page.locator('#ai-tool').scrollIntoViewIfNeeded();

    // Verify AI assessment tool section exists
    await expect(page.getByText(/analyzes city-specific characteristics/i)).toBeVisible();

    // Verify Generate button is ready and functional
    const generateBtn = page.locator('button:has-text("Generate Risk Snippet")');
    await expect(generateBtn).toBeVisible();
    
    // Fill out the risk assessment forms to unlock the button
    await page.fill('input[placeholder="e.g. Miami, Florida"]', 'Miami, Florida');
    await page.fill('input[placeholder="e.g. 500,000"]', '450,000');

    // We expect the boundary constraint mock to work and the genkit flow to complete
    // For E2E we verify the button is clickable without generic errors
    await expect(generateBtn).toBeEnabled();
  });
});
