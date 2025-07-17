# Playwright Tests for Retro Ranker

This directory contains end-to-end tests for the Retro Ranker application using Playwright.

## Setup

1. **Install Node.js dependencies:**

   ```bash
   cd playwright
   npm install
   ```

2. **Install Playwright browsers:**

   ```bash
   npm run install-browsers
   ```

3. **Start the development server:**
   ```bash
   # From the project root
   deno task start
   ```

## Running Tests

### Basic Test Commands

- **Run all tests:**

  ```bash
  npm test
  ```

- **Run tests in headed mode (see browser):**

  ```bash
  npm run test:headed
  ```

- **Run tests with UI mode:**

  ```bash
  npm run test:ui
  ```

- **Run tests in debug mode:**

  ```bash
  npm run test:debug
  ```

- **Show test report:**
  ```bash
  npm run test:report
  ```

### Code Generation

Generate tests by recording your actions:

```bash
npm run codegen
```

This will open a browser where you can interact with your application and generate test code.

## Test Structure

- `tests/home.spec.ts` - Tests for the home page
- `tests/leaderboard.spec.ts` - Tests for the leaderboard page
- `tests/auth.spec.ts` - Tests for authentication pages
- `tests/navigation.spec.ts` - Tests for navigation functionality

## Configuration

The `playwright.config.ts` file configures:

- Test browsers (Chrome, Firefox, Safari, mobile)
- Base URL (http://localhost:8000)
- Test retries and parallel execution
- Web server startup (automatically starts `deno task start`)

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

### Common Assertions

- `expect(page).toHaveTitle(/regex/)` - Check page title
- `expect(page).toHaveURL(/regex/)` - Check current URL
- `expect(element).toBeVisible()` - Check element visibility
- `expect(element).toHaveText('text')` - Check element text
- `expect(element).toBeAccessible()` - Check accessibility

### Locating Elements

- `page.locator('css-selector')` - CSS selector
- `page.locator('[data-testid="name"]')` - Test ID (recommended)
- `page.locator('text=Button Text')` - Text content
- `page.locator('role=button')` - ARIA role

## Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Wait for network idle** after navigation: `await page.waitForLoadState('networkidle')`
3. **Test accessibility** with `expect(page).toBeAccessible()`
4. **Test responsive design** with different viewport sizes
5. **Handle async operations** properly with appropriate waits

## CI/CD Integration

The tests are configured to run in CI environments with:

- Reduced parallel workers
- Retry on failure
- HTML report generation

### GitHub Actions

This project includes automated GitHub Actions workflows for running Playwright tests:

- **🌙 Nightly Tests**: Runs automatically at 2 AM UTC daily
- **🧪 PR Tests**: Runs on every pull request and push to main/develop

For detailed information about the GitHub Actions setup, see [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md).

## Troubleshooting

### Common Issues

1. **Tests fail with "page not found"**

   - Ensure the dev server is running (`deno task start`)
   - Check the base URL in `playwright.config.ts`

2. **Element not found errors**

   - Use `data-testid` attributes for reliable selection
   - Add appropriate waits for dynamic content

3. **Browser installation issues**
   - Run `npm run install-browsers` to reinstall browsers
   - Check Node.js version compatibility

### Debug Mode

Use `npm run test:debug` to run tests in debug mode, which will:

- Open browsers in headed mode
- Pause execution on failures
- Allow step-by-step debugging
