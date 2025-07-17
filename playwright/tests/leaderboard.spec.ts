import { expect, test } from "@playwright/test";

test.describe("Leaderboard Page", () => {
  test("should load the leaderboard page", async ({ page }) => {
    await page.goto("/leaderboard");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page has a title
    await expect(page).toHaveTitle(/Leaderboard/);

    // Check that the page content is visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("should display leaderboard content", async ({ page }) => {
    await page.goto("/leaderboard");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Check for leaderboard content
    await expect(page.locator("main")).toBeVisible();

    // Check for leaderboard page container
    await expect(page.locator(".leaderboard-page")).toBeVisible();

    // Check for leaderboard title
    await expect(page.locator("h1")).toBeVisible();

    // Check for top 3 section
    await expect(page.locator(".leaderboard-top3-row")).toBeVisible();

    // Check for ranking elements (either top 3 items or rest of rankings)
    const rankingElements = page.locator(
      '.leaderboard-top3-item, .leaderboard-rank, [style*="text-align: center"]',
    );
    const rankingCount = await rankingElements.count();
    expect(rankingCount).toBeGreaterThan(0);
  });

  test("should handle empty leaderboard gracefully", async ({ page }) => {
    await page.goto("/leaderboard");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Even if empty, the page should still be accessible and show some content
    await expect(page.locator("body")).toBeVisible();
  });
});
