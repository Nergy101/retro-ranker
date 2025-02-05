RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[34m'
NC='\033[0m' # No Color

# transfer ownership of files to deno user
sudo chown -R deno:deno /root
# sudo chown -R deno:deno package.json README.md node_modules src tsconfig.app.json tsconfig.json

echo -e "${BLUE}Configuring Git Repository...${NC}"
# Mark git repository as safe for VS-Code
git config --global --add safe.directory '*'

echo -e "${BLUE}Run deno install...${NC}"
deno install