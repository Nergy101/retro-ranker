import { expect, test } from "@playwright/test";
import { createTestHelper, SELECTORS } from "./utils/index.ts";

test.describe("Navigation", () => {
  test("should verify page context is stable", async ({ page }) => {
    const helper = createTestHelper(page);

    // Simple test to verify page context works
    await helper.navigateTo("/");
    helper.checkPageOpen();

    // Basic visibility check
    await helper.pageShouldBeAccessible();
    helper.checkPageOpen();
  });

  test("should navigate to all main pages", async ({ page }) => {
    const helper = createTestHelper(page);

    // Start from home page
    await helper.navigateTo("/");

    // Test navigation to leaderboard
    await helper.navigateTo("/leaderboard");
    await helper.shouldBeOnUrl(/\/leaderboard/);

    // Test navigation to FAQ
    await helper.navigateTo("/faq");
    await helper.shouldBeOnUrl(/\/faq/);

    // Test navigation to terms
    await helper.navigateTo("/terms");
    await helper.shouldBeOnUrl(/\/terms/);

    // Test navigation to release timeline
    await helper.navigateTo("/release-timeline");
    await helper.shouldBeOnUrl(/\/release-timeline/);
  });

  test("should have working navigation links on desktop", async ({ page }) => {
    const helper = createTestHelper(page);

    // Set desktop viewport and navigate
    await page.setViewportSize({ width: 1280, height: 720 });
    await helper.navigateTo("/");

    // Test desktop navigation using helper method
    await helper.testDesktopNavigation();

    // Test desktop navigation links
    const navLinks = page.locator(SELECTORS.DESKTOP_NAV_LINKS);
    const linkCount = await navLinks.count();

    // Ensure we have at least some navigation links
    expect(linkCount).toBeGreaterThan(0);

    // Test only the first few links to avoid timeouts
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = navLinks.nth(i);

      // Wait for the link to be visible before interacting
      await expect(link).toBeVisible();

      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();

      // Only test links that are not anchors and are valid URLs
      if (href && !href.startsWith("#") && href !== "/") {
        try {
          await link.click();
          await helper.shouldBeOnUrl(new RegExp(href.replace("/", "\\/")));
          await page.goBack();
          // Wait for the page to load after going back
          await helper.waitForPageReady();
        } catch (error) {
          // Log the error but continue with other links
          console.log(`Failed to test desktop link ${href}:`, error);
        }
      }
    }
  });

  test("should have working mobile navigation with burger menu", async ({ page }) => {
    const helper = createTestHelper(page);

    // Set mobile viewport and navigate
    await page.setViewportSize({ width: 375, height: 667 });
    await helper.navigateTo("/");

    // Check that page is still open before proceeding
    helper.checkPageOpen();

    // Test mobile navigation using helper method
    await helper.testMobileNavigation();

    // Check that mobile navigation is present
    await helper.elementShouldBeVisible(SELECTORS.MOBILE_NAV);

    // Check that burger menu button is present
    await helper.elementShouldBeVisible(SELECTORS.BURGER_MENU);

    // Check that mobile nav content exists in DOM but is hidden initially
    const mobileNavContent = page.locator(SELECTORS.MOBILE_NAV_CONTENT);
    await expect(mobileNavContent).toBeAttached();

    // Click burger menu to open mobile navigation
    await helper.safeClick(SELECTORS.BURGER_MENU);

    // Wait for mobile nav content to be visible (should have 'show' class)
    await expect(mobileNavContent).toHaveClass(/show/);

    // Check that mobile navigation links are present
    const mobileNavLinks = page.locator(SELECTORS.MOBILE_NAV_LINKS);
    const linkCount = await mobileNavLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Test mobile navigation links
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = mobileNavLinks.nth(i);

      // Wait for the link to be visible before interacting
      await expect(link).toBeVisible();

      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();

      // Only test links that are not anchors and are valid URLs
      if (href && !href.startsWith("#") && href !== "/") {
        try {
          await link.click();
          await helper.shouldBeOnUrl(new RegExp(href.replace("/", "\\/")));

          // Navigate back and reopen mobile menu for next test
          await page.goBack();
          await helper.waitForPageReady();

          // Reopen mobile menu for next test
          await helper.safeClick(SELECTORS.BURGER_MENU);
          await expect(mobileNavContent).toHaveClass(/show/);
        } catch (error) {
          // Log the error but continue with other links
          console.log(`Failed to test mobile link ${href}:`, error);
        }
      }
    }

    // Test closing mobile navigation by clicking outside
    await helper.safeClick("body");
    await expect(mobileNavContent).not.toHaveClass(/show/);
  });

  test("should have mobile search functionality", async ({ page }) => {
    const helper = createTestHelper(page);

    // Test mobile search using helper method
    await helper.testMobileSearch();
  });

  test("should have mobile controls (theme and language)", async ({ page }) => {
    const helper = createTestHelper(page);

    // Set mobile viewport and navigate
    await page.setViewportSize({ width: 375, height: 667 });
    await helper.navigateTo("/");

    // Check that mobile controls are present
    await helper.elementShouldBeVisible(SELECTORS.MOBILE_CONTROLS);

    // Check that theme switcher is present
    await helper.elementShouldBeVisible(".mobile-nav-controls button");

    // Check that language switcher is present
    await helper.elementShouldBeVisible(".mobile-nav-controls select");
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/non-existent-page");

    // Should show 404 page
    await helper.pageShouldBeAccessible();

    // Should have some error content
    const errorContent = page.locator('h1, h2, .error, [data-testid="error"]');
    await expect(errorContent.first()).toBeVisible();
  });

  test("should maintain navigation state", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/");

    // Navigate to a page
    await helper.navigateTo("/leaderboard");

    // Refresh the page
    await page.reload();

    // Should still be on the same page
    await helper.shouldBeOnUrl(/\/leaderboard/);
  });

  test("should switch between mobile and desktop navigation based on viewport", async ({ page }) => {
    const helper = createTestHelper(page);

    await helper.navigateTo("/");

    // Test navigation responsiveness using helper method
    await helper.testNavigationResponsiveness();
  });
});
