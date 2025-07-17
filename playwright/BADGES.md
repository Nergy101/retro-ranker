# Test Status Badges

You can add these badges to your README.md to show the status of your Playwright
tests.

## GitHub Actions Badge

Add this to your README.md to show the status of the Playwright tests workflow:

```markdown
![Playwright Tests](https://github.com/{owner}/{repo}/workflows/🧪%20Playwright%20Tests/badge.svg)
```

Replace `{owner}` and `{repo}` with your GitHub username and repository name.

## Example

For a repository at `github.com/username/retro-ranker`, the badge would be:

```markdown
![Playwright Tests](https://github.com/username/retro-ranker/workflows/🧪%20Playwright%20Tests/badge.svg)
```

## Nightly Tests Badge

To show the status of the nightly tests:

```markdown
![Nightly Tests](https://github.com/{owner}/{repo}/workflows/🌙%20Nightly%20Playwright%20Tests/badge.svg)
```

## Complete Example

Here's how you might add these to your main README.md:

```markdown
# Retro Ranker

A comprehensive database and ranking system for retro gaming handhelds.

## Status

![Playwright Tests](https://github.com/username/retro-ranker/workflows/🧪%20Playwright%20Tests/badge.svg)
![Nightly Tests](https://github.com/username/retro-ranker/workflows/🌙%20Nightly%20Playwright%20Tests/badge.svg)

## Features

- Browse and compare retro gaming handhelds
- View detailed specifications and ratings
- Track new releases and upcoming devices
- Community reviews and ratings
```

## Badge Colors

The badges will automatically show:

- 🟢 **Green**: All tests passing
- 🔴 **Red**: Some tests failing
- 🟡 **Yellow**: Tests are running
- ⚫ **Gray**: No recent test runs
