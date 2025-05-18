#!/bin/bash
# Initialize a GitHub repository and make the first commit

# Set repository name (you can change this)
REPO_NAME="xss-educational-lab"

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Initializing Git repository...${NC}"
git init

echo -e "${YELLOW}Adding all files to Git...${NC}"
git add .

echo -e "${YELLOW}Making initial commit...${NC}"
git commit -m "Initial commit: XSS Educational Lab"

echo -e "${YELLOW}Setting default branch to main...${NC}"
git branch -M main

echo -e "${GREEN}Local Git repository initialized successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create a new repository on GitHub at: https://github.com/new"
echo "2. Name your repository: $REPO_NAME"
echo "3. Do NOT initialize with README, .gitignore, or license"
echo "4. Run the following commands after creating your repository:"
echo ""
echo -e "${GREEN}  git remote add origin https://github.com/YOUR-USERNAME/$REPO_NAME.git${NC}"
echo -e "${GREEN}  git push -u origin main${NC}"
echo ""
echo "Replace YOUR-USERNAME with your actual GitHub username"