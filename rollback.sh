#!/bin/bash
# rollback.sh — safe rollback for RentFAX production
set -e

SITE="rentfax-demo"  # your Firebase Hosting site name
FUNCTION_NAME="rentfax-demo-ssr"  # Firebase auto-generated SSR function name

echo "🔁 Fetching latest Hosting versions..."
firebase hosting:versions:list --site $SITE --limit 5

read -p "Enter version ID to roll back to: " VERSION_ID

if [ -z "$VERSION_ID" ]; then
  echo "❌ No version ID entered, aborting."
  exit 1
fi

echo "🚀 Rolling back to Hosting version $VERSION_ID..."
firebase hosting:rollback --site $SITE --version $VERSION_ID

echo "🔁 Rolling back Cloud Function container (optional)..."
gcloud run services update $FUNCTION_NAME --revision "previous" || echo "ℹ️ Skip if Cloud Run rollback not needed."

echo "✅ Rollback complete."
