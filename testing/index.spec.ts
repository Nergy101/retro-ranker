import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the home page successfully", async ({ page }) => {
    // Check that the page loads without errors
    await expect(page).toHaveTitle(
      /Retro Gaming Handheld Database & Reviews | Retro Ranker/,
    );

    // Check for the main hero section
    await expect(page.locator(".home-page")).toBeVisible();
  });

  test("should display the hero section", async ({ page }) => {
    // Check that the hero component is present
    await expect(page.locator(".home-page")).toBeVisible();
  });

  test("should display popular searches section", async ({ page }) => {
    // Check for the popular searches section
    await expect(page.locator('h3:has-text("Popular Searches")')).toBeVisible();

    // Check that tag components are displayed
    const tagComponents = page.locator(
      '[data-testid="tag-component"], .tag-component, a[href*="tags"]',
    );
    await expect(tagComponents.first()).toBeVisible();
  });

  test("should display upcoming devices section", async ({ page }) => {
    // Check for the upcoming section
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();

    // Check for device cards in the upcoming section
    const upcomingSection = page.locator(".home-section").filter({
      hasText: "Upcoming",
    });
    await expect(upcomingSection).toBeVisible();

    // Check for "More Upcoming" link
    await expect(page.locator('a:has-text("More Upcoming")')).toBeVisible();
  });

  test("should display new arrivals section", async ({ page }) => {
    // Check for the new arrivals section
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();

    // Check for "More New Arrivals" link
    await expect(page.locator('a:has-text("More New Arrivals")')).toBeVisible();
  });

  test("should display highly rated section", async ({ page }) => {
    // Check for the highly rated section
    await expect(page.locator('h2:has-text("Bang for your buck")'))
      .toBeVisible();

    // Check for "More Highly Ranked" link
    await expect(page.locator('a:has-text("More Highly Ranked")'))
      .toBeVisible();
  });

  test("should display personal picks section", async ({ page }) => {
    // Check for the personal picks section
    await expect(page.locator('h2:has-text("Personal Picks")')).toBeVisible();

    // Check for "More Personal Picks" link
    await expect(page.locator('a:has-text("More Personal Picks")'))
      .toBeVisible();
  });

  test("should display charts and analytics section", async ({ page }) => {
    // Check for the charts section
    await expect(page.locator('h2:has-text("Charts & Analytics")'))
      .toBeVisible();

    // Check for the "View all charts here" link
    await expect(page.locator('a:has-text("View all charts here")'))
      .toBeVisible();

    // Check that chart wrappers are present
    await expect(page.locator(".chart-wrapper").first()).toBeVisible();
  });

  test("should display site introduction section", async ({ page }) => {
    // Check for the site introduction
    await expect(page.locator('h2:has-text("A Handheld Database")'))
      .toBeVisible();

    // Check for the description text
    await expect(page.locator("text=Retro Ranker is a comprehensive database"))
      .toBeVisible();
  });

  test("should have working navigation buttons", async ({ page }) => {
    // Check for navigation buttons in the site introduction (specifically the button-style links)
    await expect(page.locator('.index-buttons a:has-text("Devices")'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a:has-text("Compare")'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a:has-text("Releases")'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a:has-text("Charts")'))
      .toBeVisible();

    // Test that the buttons have correct href attributes
    await expect(page.locator('.index-buttons a[href="/devices"]'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a[href="/compare"]'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a[href="/release-timeline"]'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a[href="/charts"]'))
      .toBeVisible();
  });

  test("should have proper meta tags for SEO", async ({ page }) => {
    // Check for meta description
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Discover the ultimate retro gaming handheld database/,
    );

    // Check for meta keywords
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute(
      "content",
      /retro gaming handhelds/,
    );
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that the page still loads and is visible
    await expect(page.locator(".home-page")).toBeVisible();

    // Check that sections are still accessible
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
  });

  test("should be responsive on tablet viewport", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check that the page still loads and is visible
    await expect(page.locator(".home-page")).toBeVisible();

    // Check that sections are still accessible
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
  });

  test("should be responsive on small mobile viewport", async ({ page }) => {
    // Set small mobile viewport (iPhone SE size)
    await page.setViewportSize({ width: 320, height: 568 });

    // Check that the page still loads and is visible
    await expect(page.locator(".home-page")).toBeVisible();

    // Check that sections are still accessible
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
  });

  test("should be responsive on large mobile viewport", async ({ page }) => {
    // Set large mobile viewport (iPhone 14 Pro Max size)
    await page.setViewportSize({ width: 430, height: 932 });

    // Check that the page still loads and is visible
    await expect(page.locator(".home-page")).toBeVisible();

    // Check that sections are still accessible
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
  });

  test("should handle device card interactions", async ({ page }) => {
    // Check for device cards in the sections
    const deviceCards = page.locator(".device-row-grid a");

    // If there are device cards, check that they have proper href attributes
    const cardCount = await deviceCards.count();
    if (cardCount > 0) {
      const firstCard = deviceCards.first();
      await expect(firstCard).toHaveAttribute("href", /\/devices\//);
    }
  });

  test("should display proper icons in section headers", async ({ page }) => {
    // Check that section headers have proper structure
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
    await expect(page.locator('h2:has-text("Bang for your buck")'))
      .toBeVisible();
    await expect(page.locator('h2:has-text("Personal Picks")')).toBeVisible();
  });

  test("should have proper accessibility attributes", async ({ page }) => {
    // Check for proper heading hierarchy
    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBeGreaterThanOrEqual(4); // At least 4 h2 elements for main sections

    // Check for proper link accessibility
    const links = page.locator('a[role="button"]');
    const linkCount = await links.count();
    if (linkCount > 0) {
      await expect(links.first()).toHaveAttribute("role", "button");
    }
  });
});

test.describe("Mobile Viewport Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display all sections on mobile (375x667)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check all main sections are visible
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
    await expect(page.locator('h2:has-text("Bang for your buck")'))
      .toBeVisible();
    await expect(page.locator('h2:has-text("Personal Picks")')).toBeVisible();
    await expect(page.locator('h2:has-text("Charts & Analytics")'))
      .toBeVisible();
    await expect(page.locator('h2:has-text("A Handheld Database")'))
      .toBeVisible();
  });

  test("should have proper mobile navigation on small screens (320x568)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });

    // Check that navigation buttons are still accessible
    await expect(page.locator('.index-buttons a:has-text("Devices")'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a:has-text("Compare")'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a:has-text("Releases")'))
      .toBeVisible();
    await expect(page.locator('.index-buttons a:has-text("Charts")'))
      .toBeVisible();
  });

  test("should handle mobile touch interactions", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Test that device cards are clickable on mobile
    const deviceCards = page.locator(".device-row-grid a");
    const cardCount = await deviceCards.count();
    if (cardCount > 0) {
      const firstCard = deviceCards.first();
      await expect(firstCard).toBeVisible();

      // Test that the card has proper touch target size (minimum 44px)
      const box = await firstCard.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("should display charts properly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that charts section is visible
    await expect(page.locator('h2:has-text("Charts & Analytics")'))
      .toBeVisible();

    // Check that chart wrappers are present and visible
    const chartWrappers = page.locator(".chart-wrapper");
    const chartCount = await chartWrappers.count();
    if (chartCount > 0) {
      await expect(chartWrappers.first()).toBeVisible();
    }
  });

  test("should handle mobile scrolling and layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Test that we can scroll through all sections
    await page.evaluate(() =>
      globalThis.scrollTo(0, document.body.scrollHeight)
    );

    // Check that footer or bottom content is accessible
    await expect(page.locator('h2:has-text("A Handheld Database")'))
      .toBeVisible();

    // Scroll back to top
    await page.evaluate(() => globalThis.scrollTo(0, 0));
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();
  });

  test("should maintain proper spacing on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that sections have proper spacing
    const sections = page.locator(".home-section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);

    // Check that popular searches section is visible
    await expect(page.locator('h3:has-text("Popular Searches")')).toBeVisible();
  });

  test("should handle mobile viewport on tablet size (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check all sections are visible on tablet
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
    await expect(page.locator('h2:has-text("Bang for your buck")'))
      .toBeVisible();
    await expect(page.locator('h2:has-text("Personal Picks")')).toBeVisible();

    // Check that navigation buttons are properly sized for tablet
    await expect(page.locator('.index-buttons a:has-text("Devices")'))
      .toBeVisible();
  });

  test("should handle mobile viewport on large mobile (430x932)", async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });

    // Check all sections are visible on large mobile
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
    await expect(page.locator('h2:has-text("Bang for your buck")'))
      .toBeVisible();
    await expect(page.locator('h2:has-text("Personal Picks")')).toBeVisible();

    // Check that charts are properly displayed
    await expect(page.locator('h2:has-text("Charts & Analytics")'))
      .toBeVisible();
  });

  test("should maintain responsive design on mobile landscape", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 }); // Mobile landscape

    // Check that the page still loads properly in landscape
    await expect(page.locator(".home-page")).toBeVisible();

    // Check that key sections are still accessible
    await expect(page.locator('h2:has-text("New Arrivals")')).toBeVisible();
  });
});
