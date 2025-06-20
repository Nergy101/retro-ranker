#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[34m'
NC='\033[0m' # No Color

trap 'echo -e "${RED}postattach.sh failed.${NC}"' ERR

echo -e "${BLUE}Configuring Git User...${NC}"

# Check GitHub authentication status
if ! gh auth status -t >/dev/null 2>&1; then
    echo -e "${RED}Git authentication status is negative. Performing login...${NC}"
    gh auth login || { echo -e "${RED}gh auth login failed${NC}"; exit 1; }
else
    echo -e "${GREEN}Git authentication status is positive. No need to login.${NC}"
fi

echo "run 'gh auth status' to see more details."
echo ''

# run deno run start
echo -e "${BLUE}Starting development server...${NC}"
deno task start || { echo -e "${RED}Failed to start server${NC}"; exit 1; }
