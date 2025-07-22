#!/bin/bash

# Test Failure Handler Script
# This script runs Playwright tests and handles failures gracefully
# Updated for matrix job support

set -e

echo "🧪 Processing Playwright test results..."

# Check if we're in a matrix job
if [ -n "$GITHUB_JOB" ]; then
    echo "📋 Running in GitHub Actions matrix job: $GITHUB_JOB"
fi

# Check if test results exist
if [ ! -d "test-results" ] && [ ! -f "test-results.json" ]; then
    echo "⚠️  No test results found. Tests may not have run or failed before completion."
    echo "📊 This could indicate:"
    echo "   - Tests failed to start"
    echo "   - Environment setup issues"
    echo "   - Network connectivity problems"
    
    if [ "$CI" = "true" ]; then
        echo "🚀 Continuing pipeline despite missing test results..."
        exit 0
    else
        echo "🔍 Local development - exiting with failure code"
        exit 1
    fi
fi

# Check if tests failed by looking for test results
if [ -f "test-results.json" ]; then
    echo "📋 Test Summary from test-results.json:"
    
    # Use jq if available, otherwise fallback to basic parsing
    if command -v jq &> /dev/null; then
        TOTAL=$(jq '.stats.total' test-results.json 2>/dev/null || echo 'N/A')
        PASSED=$(jq '.stats.passed' test-results.json 2>/dev/null || echo 'N/A')
        FAILED=$(jq '.stats.failed' test-results.json 2>/dev/null || echo 'N/A')
        SKIPPED=$(jq '.stats.skipped' test-results.json 2>/dev/null || echo 'N/A')
        
        echo "   Total tests: $TOTAL"
        echo "   Passed: $PASSED"
        echo "   Failed: $FAILED"
        echo "   Skipped: $SKIPPED"
        
        # Check if there were failures
        if [ "$FAILED" != "N/A" ] && [ "$FAILED" -gt 0 ]; then
            echo "❌ Tests failed (exit code: $FAILED)"
            TEST_EXIT_CODE=1
        else
            echo "✅ All tests passed!"
            TEST_EXIT_CODE=0
        fi
    else
        echo "   jq not available, using basic parsing..."
        if grep -q '"failed":[1-9]' test-results.json 2>/dev/null; then
            echo "❌ Tests failed"
            TEST_EXIT_CODE=1
        else
            echo "✅ All tests passed!"
            TEST_EXIT_CODE=0
        fi
    fi
else
    echo "📋 No test-results.json found, checking test-results directory..."
    
    # Check for failed test files in test-results directory
    if [ -d "test-results" ]; then
        FAILED_COUNT=$(find test-results -name "*.json" -exec grep -l '"status":"failed"' {} \; | wc -l)
        if [ "$FAILED_COUNT" -gt 0 ]; then
            echo "❌ Found $FAILED_COUNT failed test files"
            TEST_EXIT_CODE=1
        else
            echo "✅ No failed test files found"
            TEST_EXIT_CODE=0
        fi
    else
        echo "⚠️  No test results directory found"
        TEST_EXIT_CODE=1
    fi
fi

# Generate detailed failure report if there are failures
if [ "$TEST_EXIT_CODE" = "1" ]; then
    echo "📊 Detailed failure report:"
    
    if [ -d "test-results" ]; then
        echo "   Failed test files:"
        find test-results -name "*.json" -exec grep -l '"status":"failed"' {} \; | head -5 | while read file; do
            echo "     - $(basename "$file")"
        done
    fi
    
    if [ -d "screenshots" ]; then
        SCREENSHOT_COUNT=$(find screenshots -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)
        echo "   Screenshots taken: $SCREENSHOT_COUNT"
    fi
fi

# In CI, we want to continue but report the failure
if [ "$CI" = "true" ]; then
    echo "🚀 Continuing pipeline despite test failures..."
    exit 0
else
    echo "🔍 Local development - exiting with failure code"
    exit $TEST_EXIT_CODE
fi 