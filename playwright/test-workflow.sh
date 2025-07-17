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

# Check if Deno is available
if ! command -v deno &> /dev/null; then
    echo "❌ Error: deno is not installed"
    exit 1
fi

DENO_VERSION=$(deno --version | head -n 1)
echo "📦 Deno version: $DENO_VERSION"

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

# Test that the development server can start
echo "🚀 Testing development server startup..."
timeout 30s deno task start &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 5

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Development server started successfully"
    
    # Test that the server responds
    if curl -s http://localhost:8000 > /dev/null; then
        echo "✅ Server is responding on http://localhost:8000"
    else
        echo "⚠️  Server started but not responding on http://localhost:8000"
    fi
    
    # Stop the server
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
else
    echo "❌ Failed to start development server"
    exit 1
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