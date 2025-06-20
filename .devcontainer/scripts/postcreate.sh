#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[34m'
NC='\033[0m' # No Color

trap 'echo -e "${RED}postcreate.sh failed.${NC}"' ERR

# transfer ownership of files to deno user
echo -e "${BLUE}Setting permissions...${NC}"
sudo chown -R deno:deno /root || { echo -e "${RED}Failed to change ownership${NC}"; exit 1; }
# sudo chown -R deno:deno package.json README.md node_modules src tsconfig.app.json tsconfig.json

echo -e "${BLUE}Configuring Git Repository...${NC}"
# Mark git repository as safe for VS-Code
git config --global --add safe.directory '*' || { echo -e "${RED}Failed to configure git${NC}"; exit 1; }

echo -e "${GREEN}postcreate.sh completed successfully.${NC}"
