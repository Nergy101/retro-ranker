import { expect, test } from "@playwright/test";
import { createTestHelper, SELECTORS } from "./utils/index.ts";

test.describe("Home Page", () => {
  test("should load the home page with correct title and meta", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page with robust waiting
    await helper.navigateTo("/", {
      waitForLoadState: "networkidle",
      waitForSelector: "main.main-content",
    });

    // Check that the page has the correct title
    await helper.pageShouldHaveTitle(/Retro Ranker - Home/);

    // Check for meta description
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Retro Ranker - Home to browse and compare retro gaming handhelds/,
    );
  });

  test("should display hero section with main content", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check for hero container
    await helper.elementShouldBeVisible(".hero-container");

    // Check for main heading with "Retro Ranker"
    await expect(page.locator("h1")).toContainText("Retro Ranker");

    // Check for hero description
    await helper.elementShouldBeVisible(".hero-section p");

    // Check for join community button in hero section
    await helper.elementShouldBeVisible(
      '.hero-section a[href="/auth/sign-in"]',
    );

    // Check for hero image
    await helper.elementShouldBeVisible('img[alt="Retro Ranker"]');
  });

  test("should display navigation elements", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check for navigation elements using helper method
    await helper.checkNavigationElements();

    // Check for main content area
    await helper.elementShouldBeVisible("main.main-content");

    // Check for footer
    await helper.elementShouldBeVisible("footer");
  });

  test("should display popular searches section", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check for popular searches container
    await helper.elementShouldBeVisible(".popular-searches-container");

    // Check for popular searches heading
    await helper.elementShouldBeVisible(".popular-searches-container h3");

    // Check for tag components (should have multiple tags)
    const tags = page.locator(".popular-searches-container a");
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);
  });

  test("should display device sections", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check for all main device sections
    await expect(page.locator(".home-section")).toHaveCount(4);

    // Check for specific section titles using more specific selectors
    await helper.elementShouldBeVisible(
      "h2.home-section-title:has-text('New Arrivals')",
    );
    await expect(
      page.locator("h2.home-section-title").filter({
        hasText: /Bang for.*buck/i,
      }),
    ).toBeVisible();
    await helper.elementShouldBeVisible(
      "h2.home-section-title:has-text('Upcoming')",
    );
    await helper.elementShouldBeVisible(
      "h2.home-section-title:has-text('Personal Picks')",
    );

    // Check that each section has device cards
    const deviceCards = page.locator(".device-card");
    const cardCount = await deviceCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Check for "See More" cards
    const seeMoreCards = page.locator(".see-more-card");
    const seeMoreCount = await seeMoreCards.count();
    expect(seeMoreCount).toBeGreaterThan(0);
  });

  test("should display site introduction section", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check for site introduction
    await helper.elementShouldBeVisible(".site-introduction");

    // Check for handheld database heading
    await helper.elementShouldBeVisible(".site-introduction h2");

    // Check for action buttons
    const actionButtons = page.locator(".index-buttons a");
    const buttonCount = await actionButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Check for specific navigation buttons in the index-buttons section
    await helper.elementShouldBeVisible('.index-buttons a[href="/devices"]');
    await helper.elementShouldBeVisible('.index-buttons a[href="/compare"]');
    await helper.elementShouldBeVisible(
      '.index-buttons a[href="/release-timeline"]',
    );
    await helper.elementShouldBeVisible('.index-buttons a[href="/charts"]');
  });

  test("should be responsive across different viewport sizes", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Test responsive design using helper method
    await helper.testResponsiveDesign();
  });

  test("should have working device card links", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check that device cards are clickable and have proper hrefs
    const deviceCardLinks = page.locator("a[href^='/devices/']");
    const linkCount = await deviceCardLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Check that links point to device pages
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const href = await deviceCardLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/devices\/.+/);
    }
  });

  test("should have working navigation links", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check that "See More" cards have proper links
    const seeMoreLinks = page.locator(".see-more-card");
    const seeMoreCount = await seeMoreLinks.count();
    expect(seeMoreCount).toBeGreaterThan(0);

    // Check that action buttons have proper links
    const actionLinks = page.locator(".index-buttons a");
    const actionCount = await actionLinks.count();
    expect(actionCount).toBeGreaterThan(0);

    // Verify specific expected links exist
    const expectedLinks = [
      {
        href: "/devices?sort=new-arrivals",
        selector: ".see-more-card[href='/devices?sort=new-arrivals']",
      },
      {
        href: "/devices?tags=mid&sort=highly-ranked",
        selector: ".see-more-card[href='/devices?tags=mid&sort=highly-ranked']",
      },
      {
        href: "/devices?tags=upcoming",
        selector: ".see-more-card[href='/devices?tags=upcoming']",
      },
      {
        href: "/devices?tags=personal-pick",
        selector: ".see-more-card[href='/devices?tags=personal-pick']",
      },
    ];

    for (const expectedLink of expectedLinks) {
      await helper.elementShouldBeVisible(expectedLink.selector);
    }
  });

  test("should display device images and information", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check for device images
    const deviceImages = page.locator(".device-card-image");
    const imageCount = await deviceImages.count();
    expect(imageCount).toBeGreaterThan(0);

    // Check for device names
    const deviceNames = page.locator(".device-card-hgroup strong");
    const nameCount = await deviceNames.count();
    expect(nameCount).toBeGreaterThan(0);

    // Check for device brands
    const deviceBrands = page.locator(".device-card-hgroup span");
    const brandCount = await deviceBrands.count();
    expect(brandCount).toBeGreaterThan(0);
  });

  test("should test mobile navigation functionality", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Test mobile navigation using helper method
    await helper.testMobileNavigation();
  });

  test("should test desktop navigation functionality", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Test desktop navigation using helper method
    await helper.testDesktopNavigation();
  });

  test("should test navigation responsiveness", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Test navigation responsiveness using helper method
    await helper.testNavigationResponsiveness();
  });

  test("should handle page accessibility", async ({ page }) => {
    const helper = createTestHelper(page);

    // Navigate to home page
    await helper.navigateTo("/");

    // Check page accessibility using helper method
    await helper.pageShouldBeAccessible();
  });
});
