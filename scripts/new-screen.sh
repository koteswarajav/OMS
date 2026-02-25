#!/bin/bash
# Creates a new screen from the template.
# Usage (in Git Bash): ./scripts/new-screen.sh CheckoutScreen
# Result: screens/CheckoutScreen.tsx with component name updated

SCREEN_NAME=$1

if [ -z "$SCREEN_NAME" ]; then
  echo "Usage: ./scripts/new-screen.sh <ScreenName>"
  echo "Example: ./scripts/new-screen.sh CheckoutScreen"
  exit 1
fi

TARGET="screens/${SCREEN_NAME}.tsx"

if [ -f "$TARGET" ]; then
  echo "Screen already exists: $TARGET"
  exit 1
fi

cp screens/_template.tsx "$TARGET"
sed -i "s/ScreenTemplate/$SCREEN_NAME/g" "$TARGET"

echo ""
echo "Created: $TARGET"
echo ""
echo "Next steps:"
echo "  1. Edit $TARGET to add your UI"
echo "  2. Import it into a flow in flows/"
echo "  3. Register the flow in prototypes/App.tsx"
