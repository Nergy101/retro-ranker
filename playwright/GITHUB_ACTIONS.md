# GitHub Actions for Playwright Tests

This document describes the GitHub Actions workflows that run Playwright tests
for the Retro Ranker application.

## Workflows

### 🌙 Nightly Playwright Tests (`nightly-tests.yml`)

**Schedule:** Runs automatically at 2 AM UTC every day

**Purpose:**

- Ensures the application is working correctly on a daily basis
- Catches regressions that might be introduced over time
- Provides a baseline for application health

**Features:**

- Runs all Playwright tests across multiple browsers
- Uploads test results and screenshots as artifacts
- Generates test summaries in GitHub
- Creates test status badges
- Can be manually triggered via workflow dispatch

### 🧪 Playwright Tests (`playwright-tests.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger via workflow dispatch

**Purpose:**

- Validates changes before they are merged
- Provides immediate feedback on pull requests
- Ensures code quality and functionality

**Features:**

- Runs tests on every PR and push
- Comments on pull requests with test results
- Parses and displays detailed test statistics
- Uploads artifacts for review
- Removes duplicate comments on PRs

## Test Results

### Artifacts

Both workflows upload the following artifacts:

1. **Test Results** (`playwright-test-results-{run_number}`)

   - JSON test result files
   - HTML test reports
   - Trace files for debugging

2. **Screenshots** (`playwright-screenshots-{run_number}`)
   - Screenshots taken during test execution
   - Useful for visual regression testing
   - Debugging UI issues

### GitHub Integration

#### Pull Request Comments

When tests run on pull requests, the workflow automatically:

- Comments on the PR with test results
- Shows pass/fail statistics
- Provides links to artifacts
- Removes previous bot comments to avoid clutter

#### Step Summaries

Each workflow run includes detailed step summaries showing:

- Test execution statistics
- Pass/fail counts
- Duration information
- Links to artifacts

#### Test Status Badge

The nightly workflow creates a test status badge showing:

- Overall test status (passing/failing)
- Last run timestamp
- Next scheduled run

## Configuration

### Environment Setup

The workflows automatically set up:

- **Node.js 20** for Playwright
- **All required browsers** (Chrome, Firefox, Safari, mobile)
- **Dependency caching** for faster builds

**Note:** Tests run against the production site (https://retroranker.site) in CI to avoid development server issues.

### Test Configuration

Tests run with the following settings:

- **Timeout:** 30 minutes per job
- **Retries:** 2 retries on CI for failed tests
- **Parallel execution:** Disabled on CI for stability
- **Browsers:** Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

### Caching

The workflows use GitHub Actions caching for:

- **npm dependencies** (Node.js packages)
- **Playwright browsers** (installed automatically)

## Usage

### Manual Trigger

To manually run tests:

1. Go to the **Actions** tab in GitHub
2. Select either workflow
3. Click **Run workflow**
4. Choose the branch to test
5. Click **Run workflow**

### Viewing Results

#### In GitHub Actions

1. Go to the **Actions** tab
2. Click on a workflow run
3. View the step summaries and logs
4. Download artifacts if needed

#### In Pull Requests

1. Open a pull request
2. Look for the automated comment with test results
3. Click on the **Actions** tab to see detailed logs
4. Download artifacts for detailed analysis

### Local Development

To run tests locally:

```bash
cd playwright
npm install
npx playwright install
npm test
```

## Troubleshooting

### Common Issues

1. **Tests fail with "page not found"**

   - Check that the production site (https://retroranker.site) is accessible
   - Verify the base URL is correct in `playwright.config.ts`

2. **Browser installation fails**

   - The workflow automatically installs browsers
   - Check the logs for specific error messages

3. **Tests timeout**

   - Increase the timeout in the workflow if needed
   - Check for slow network requests or heavy operations

4. **Artifacts not uploaded**
   - Ensure the `if: always()` condition is present
   - Check that the paths exist before upload

### Debug Mode

To debug test issues:

1. Run tests locally with `npm run test:debug`
2. Use `npm run test:ui` for interactive mode
3. Check the HTML report in `playwright-report/`

## Customization

### Adding New Tests

1. Create test files in `playwright/tests/`
2. Follow the existing test patterns
3. Use the test helpers in `playwright/tests/utils/test-helpers.ts`

### Modifying Workflows

1. Edit the workflow files in `.github/workflows/`
2. Test changes locally first
3. Use workflow dispatch to test changes

### Environment Variables

Add environment variables to the workflow if needed:

```yaml
env:
  CI: true
  NODE_ENV: test
  # Add other variables as needed
```

## Best Practices

1. **Keep tests fast** - Use appropriate timeouts and waits
2. **Use data-testid** - For reliable element selection
3. **Test accessibility** - Include accessibility checks
4. **Handle async operations** - Use proper waits and assertions
5. **Clean up artifacts** - Set appropriate retention periods
6. **Monitor test stability** - Address flaky tests promptly
