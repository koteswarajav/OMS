#!/bin/bash
# Pushes the current state as a named variant branch.
# Vercel auto-deploys every branch push and generates a unique preview URL.
# Usage (in Git Bash): ./scripts/deploy-variant.sh checkout-v2

VARIANT_NAME=$1

if [ -z "$VARIANT_NAME" ]; then
  echo "Usage: ./scripts/deploy-variant.sh <variant-name>"
  echo "Example: ./scripts/deploy-variant.sh checkout-v2"
  exit 1
fi

BRANCH="variant/$VARIANT_NAME"
CURRENT_BRANCH=$(git branch --show-current)

echo ""
echo "Deploying variant: $VARIANT_NAME"
echo "Branch: $BRANCH"
echo ""

# Create or switch to variant branch
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

# Stage and commit all changes
git add -A
git commit -m "variant: $VARIANT_NAME snapshot $(date +%Y-%m-%d)"

# Push to GitHub (Vercel webhook fires automatically)
git push origin "$BRANCH"

echo ""
echo "Done! Vercel is building your preview."
echo ""
echo "Check your Vercel dashboard for the preview URL."
echo "URL pattern: https://oms-git-variant-${VARIANT_NAME}-koteswarajav.vercel.app"
echo "(Exact URL appears in Vercel dashboard under Deployments)"
echo ""

# Return to previous branch
git checkout "$CURRENT_BRANCH"
echo "Returned to branch: $CURRENT_BRANCH"
