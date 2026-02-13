#!/bin/bash
cd "$(dirname "$0")/.."

# Find all imports from deleted EE modules
echo "=== Imports from @calcom/features/ee ==="
find apps/web packages -name "*.ts" -o -name "*.tsx" | xargs grep -h "from.*@calcom/features/ee" 2>/dev/null | sort -u

echo ""
echo "=== Imports from ~/ee ==="
find apps/web -name "*.ts" -o -name "*.tsx" | xargs grep -h "from.*~/ee" 2>/dev/null | sort -u

echo ""
echo "=== Imports from @calcom/web/modules/ee ==="
find apps/web packages -name "*.ts" -o -name "*.tsx" | xargs grep -h "from.*@calcom/web/modules/ee" 2>/dev/null | sort -u
