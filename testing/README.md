# Playwright Testing

This directory contains Playwright end-to-end tests for the Retro Ranker
application.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests

```bash
npm run test
```

### Run tests in specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run tests with UI

```bash
npm run test:ui
```

### Run tests in headed mode (visible browser)

```bash
npm run test:headed
```

### Debug tests

```bash
npm run test:debug
```

### View test report

```bash
npm run test:report
```

## Test Structure

- `index.spec.ts` - Tests for the home page (index.tsx)
  - Page loading and SEO
  - Hero section
  - Popular searches
  - Device sections (Upcoming, New Arrivals, Highly Rated, Personal Picks)
  - Charts and analytics
  - Site introduction
  - Navigation buttons
  - Responsive design
  - Accessibility

## Configuration

Tests are configured in `playwright.config.ts` with:

- Chrome, Firefox, and Safari/WebKit browsers
- Local development server on port 8000
- HTML reporter for test results
- Trace collection on retry

## CI/CD

Tests run automatically on:

- Push to main/develop branches
- Pull requests to main/develop branches

Matrix strategy includes:

- Ubuntu and macOS runners
- Chrome, Firefox, and Safari/WebKit browsers
- Test reports are uploaded as artifacts
