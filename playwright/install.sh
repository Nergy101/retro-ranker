#!/bin/bash

# Playwright Installation Script for Retro Ranker

echo "🚀 Setting up Playwright for Retro Ranker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo "✅ npm dependencies installed"

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed"

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

echo "📸 Screenshots directory created"

echo ""
echo "🎉 Playwright setup complete!"
echo ""
echo "To run tests:"
echo "  npm test                    # Run all tests"
echo "  npm run test:headed         # Run tests with browser visible"
echo "  npm run test:ui             # Run tests with UI mode"
echo "  npm run test:debug          # Run tests in debug mode"
echo ""
echo "Make sure your development server is running:"
echo "  deno task start             # From the project root"
echo "" 