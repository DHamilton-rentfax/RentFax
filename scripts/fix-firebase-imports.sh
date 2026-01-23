#!/usr/bin/env bash
# fix-firebase-imports.sh
# RentFAX Firebase import cleanup utility
# Run from project root:  bash scripts/fix-firebase-imports.sh

set -e

echo "🔧 Starting Firebase import cleanup..."

# 1️⃣ Replace legacy aliases with the correct server import
echo "🧹 Replacing '@@/firebase/server' → '@/firebase/server'"
grep -Rl "@@/firebase/server" src | xargs sed -i 's|@@/firebase/server|@/firebase/server|g' || true

echo "🧹 Replacing '@/firebase/client/admin' → '@/firebase/server'"
grep -Rl "@/firebase/client/admin" src | xargs sed -i 's|@/firebase/client/admin|@/firebase/server|g' || true

# 2️⃣ Remove direct firebase-admin imports in frontend code
echo "🚫 Checking for firebase-admin usage outside of server files..."
grep -Rl "firebase-admin" src | grep -v "firebase/server" | grep -v "src/lib/firebase-admin.ts" | while read -r file; do
  echo "⚠️  Potential bad import in: $file"
done

# 3️⃣ Verify all admin SDKs are imported from server.ts
echo "🔍 Verifying '@/firebase/server' usage in API and lib files..."
grep -Rl "@/firebase/server" src/app/api src/lib || true

# 4️⃣ Make sure tsconfig path aliases are consistent
echo "✅ Ensuring tsconfig.json has @/* alias"
if ! grep -q '"@/*"' tsconfig.json; then
  echo "⚠️  Adding @/* alias to tsconfig.json"
  jq '.compilerOptions.paths["@/*"]=["*"]' tsconfig.json > tsconfig.tmp && mv tsconfig.tmp tsconfig.json
fi

# 5️⃣ Clear Next.js cache
echo "🧼 Cleaning .next cache..."
rm -rf .next

# 6️⃣ Reinstall dependencies (optional safety step)
echo "📦 Ensuring dependencies are up to date..."
npm install

echo "✅ Firebase import cleanup completed successfully!"
echo "👉 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Verify no 'node:stream' or 'firebase-admin' build errors"
echo "   3. Visit /admin and /api/sessionLogin to confirm working sessions"
