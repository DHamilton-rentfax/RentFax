
import fs from "fs";
import path from "path";

const requiredFiles = [
  "src/lib/firebase/admin.ts",
  "src/lib/firebase/client.ts",
  "src/app/api/debug-env/route.ts",
  "src/app/api/debug-services/route.ts",
  "src/app/(app)/admin/diagnostics/page.tsx",
  "src/components/dashboard/NotificationListener.tsx",
  "src/app/(app)/layout.tsx",
  "src/app/globals.css",
];

console.log("🔍 RentFAX System Health Check...");

let missing = 0;
for (const f of requiredFiles) {
  const p = path.resolve(f);
  if (!fs.existsSync(p)) {
    console.warn(`❌ Missing: ${f}`);
    missing++;
  } else {
    console.log(`✅ ${f}`);
  }
}

if (missing > 0) {
  console.log(`⚠️ ${missing} critical files missing. Commit aborted.`);
  process.exit(1);
} else {
  console.log("✅ All essential files found. Safe to commit.");
}
