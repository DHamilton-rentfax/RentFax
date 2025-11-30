import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/app");
const REQUIRED_GROUPS = ["(public)", "(renter)", "(admin)", "(auth)", "(ai)"];
let allGood = true;

console.log("🔍 Verifying RentFax structure...");

for (const group of REQUIRED_GROUPS) {
  const groupPath = path.join(ROOT, group);
  if (!fs.existsSync(groupPath)) {
    console.error(`❌ Missing route group: ${group}`);
    allGood = false;
  }
}

const lockfile = path.resolve(".rentfax-structure.lock");
if (!fs.existsSync(lockfile)) {
  console.error("❌ Missing structure lockfile (.rentfax-structure.lock)");
  allGood = false;
}

if (allGood) {
  console.log("✅ Structure verified — everything is in the correct place!");
  process.exit(0);
} else {
  console.error("\n⚠️  Fix structure issues before deploying to production.");
  process.exit(1);
}
