#!/bin/bash

# Test Workflow Setup Script
# This script helps verify that the Playwright setup will work in GitHub Actions

echo "🧪 Testing Playwright Workflow Setup"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the playwright directory."
    exit 1
fi

echo "✅ Found package.json"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ npm is available"



# Install dependencies
echo "📦 Installing npm dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo "✅ npm dependencies installed"

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install --with-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed"

# Create screenshots directory
mkdir -p screenshots
echo "✅ Screenshots directory created"

# Test that the production site is accessible
echo "🌐 Testing production site accessibility..."
if curl -s https://retroranker.site > /dev/null; then
    echo "✅ Production site is accessible"
else
    echo "⚠️  Production site may not be accessible"
fi

# Test Playwright configuration
echo "🔧 Testing Playwright configuration..."
npx playwright test --list

if [ $? -ne 0 ]; then
    echo "❌ Playwright configuration test failed"
    exit 1
fi

echo "✅ Playwright configuration is valid"

echo ""
echo "🎉 All tests passed! Your Playwright setup should work in GitHub Actions."
echo ""
echo "Next steps:"
echo "1. Commit and push your changes"
echo "2. Check the Actions tab in GitHub"
echo "3. Monitor the workflow runs"
echo ""
echo "To run tests locally:"
echo "  npm test                    # Run all tests"
echo "  npm run test:headed         # Run tests with browser visible"
echo "  npm run test:ui             # Run tests with UI mode"
echo "  npm run test:debug          # Run tests in debug mode" 