RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Configuring Git User...${NC}"

# Check GitHub authentication status
auth_status=$(gh auth status -t)

# Check if the auth status command failed
if [ $? -ne 0 ]; then
    echo -e "${RED}Git authentication status is negative. Performing login...${NC}"
    gh auth login
else
    echo -e "${GREEN}Git authentication status is positive. No need to login.${NC}"
fi

echo "run 'gh auth status' to see more details."
echo ''

# run deno run start
echo -e "${BLUE}deno run start...${NC}"
deno run start