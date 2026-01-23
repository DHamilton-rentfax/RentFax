#!/usr/bin/env bash
# fix-firebase-imports-pro.sh
# RentFAX full Firebase import repair + server safety migration
# Run from project root:  bash scripts/fix-firebase-imports-pro.sh

set -e

echo "🔧 Starting advanced Firebase import cleanup..."

# Define target directory for migrated server files
SERVER_MIGRATED="src/lib/server-migrated"
mkdir -p "$SERVER_MIGRATED"

#######################################
# 1️⃣ Replace legacy import paths
#######################################
echo "🧹 Fixing legacy Firebase paths..."
grep -Rl "@@/firebase/server" src | xargs sed -i 's|@@/firebase/server|@/firebase/server|g' || true
grep -Rl "@/firebase/client/admin" src | xargs sed -i 's|@/firebase/client/admin|@/firebase/server|g' || true

#######################################
# 2️⃣ Find unsafe firebase-admin imports
#######################################
echo "🔍 Scanning for firebase-admin imports in non-server files..."
BAD_IMPORTS=$(grep -Rl "firebase-admin" src | grep -v "src/firebase/server.ts" | grep -v "src/lib/firebase-admin.ts" || true)

if [ -z "$BAD_IMPORTS" ]; then
  echo "✅ No unsafe firebase-admin imports found!"
else
  echo "⚠️  Found firebase-admin usage outside safe zones:"
  echo "$BAD_IMPORTS"
  echo ""
  echo "🛠️  Moving these files to $SERVER_MIGRATED ..."
  
  for file in $BAD_IMPORTS; do
    newpath="$SERVER_MIGRATED/$(basename "$file")"
    mv "$file" "$newpath"
    echo "➡️  Moved $file → $newpath"
  done

  echo "🔁 Updating imports inside migrated files..."
  grep -Rl "firebase-admin" "$SERVER_MIGRATED" | xargs sed -i 's|firebase-admin|@/firebase/server|g' || true
fi

#######################################
# 3️⃣ Ensure tsconfig path aliases
#######################################
if ! grep -q '"@/*"' tsconfig.json; then
  echo "⚙️ Adding path alias to tsconfig.json"
  jq '.compilerOptions.paths["@/*"]=["*"]' tsconfig.json > tsconfig.tmp && mv tsconfig.tmp tsconfig.json
fi

#######################################
# 4️⃣ Clean Next.js and reinstall deps
#######################################
echo "🧼 Clearing build cache..."
rm -rf .next

echo "📦 Ensuring deps are up to date..."
npm install

#######################################
# 5️⃣ Verification summary
#######################################
echo ""
echo "✅ Firebase import fix completed!"
echo "📁 Any migrated files are now under: $SERVER_MIGRATED"
echo "👉 Please review them — these are server-only files."
echo ""
echo "Next steps:"
echo "1️⃣  Run: npm run dev"
echo "2️⃣  Verify build logs show no firebase-admin or node:stream errors"
echo "3️⃣  Visit /admin and /api/sessionLogin to confirm working sessions"
