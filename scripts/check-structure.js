/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const mustExist = [
  "src/app",
  "src/lib",
  "src/lib/billing",
  "src/lib/fraudEngine",
  "src/lib/public-data",
  "src/lib/public-records",
  "src/lib/risk",
  "src/lib/search",
  "src/actions",
];

const mustNotExist = [
  "lib", // root lib — should be gone
  "src/lib/publicRecords", // old camelCase folder
  "src/app/app", // old nested app
];

function checkDir(p) {
  return fs.existsSync(path.join(process.cwd(), p));
}

let ok = true;

console.log("🔍 Checking RentFAX structure...\n");

for (const p of mustExist) {
  if (!checkDir(p)) {
    console.error(`❌ MISSING: ${p}`);
    ok = false;
  } else {
    console.log(`✅ Found:   ${p}`);
  }
}

for (const p of mustNotExist) {
  if (checkDir(p)) {
    console.error(`❌ SHOULD NOT EXIST (delete me): ${p}`);
    ok = false;
  } else {
    console.log(`✅ Not present (good): ${p}`);
  }
}

if (!ok) {
  console.error("\n❌ Structure check failed. Fix the issues above.");
  process.exit(1);
}

console.log("\n🎉 Structure check passed.");
