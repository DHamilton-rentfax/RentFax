/**
 * Detect and (optionally) delete duplicate Next.js route files
 * that resolve to the same URL path across route groups.
 *
 * Safe to run anytime before build.
 */

import fs from "fs";
import path from "path";
import readline from "readline";

const appDir = path.resolve("src/app");
const routeGroups = new Set(["(app)", "(customer)", "(renter)", "(public)"]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function normalizeRoute(filePath) {
  // Convert full file path to its route path
  let route = filePath
    .replace(appDir, "")
    .replace(/page\.(js|jsx|ts|tsx)$/, "")
    .replace(/\[.*?\]/g, "[param]"); // normalize dynamic routes

  // Strip route group names
  routeGroups.forEach((group) => {
    route = route.replace(`/${group}`, "");
  });

  // Remove duplicate slashes and trailing slash
  route = route.replace(/\/+/g, "/").replace(/\/$/, "");
  if (route === "") route = "/"; // root route
  return route;
}

function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(fullPath));
    else if (entry.name.startsWith("page.")) files.push(fullPath);
  }
  return files;
}

async function main() {
  if (!fs.existsSync(appDir)) {
    console.error("❌ src/app directory not found.");
    process.exit(1);
  }

  console.log("🔍 Scanning for duplicate Next.js routes...\n");

  const allPages = walkDir(appDir);
  const routeMap = new Map();

  for (const file of allPages) {
    const route = normalizeRoute(file);
    if (!routeMap.has(route)) routeMap.set(route, []);
    routeMap.get(route).push(file);
  }

  const duplicates = [...routeMap.entries()].filter(
    ([_, files]) => files.length > 1
  );

  if (duplicates.length === 0) {
    console.log("✅ No duplicate routes detected.");
    process.exit(0);
  }

  console.log("⚠️  Found duplicate routes:\n");
  duplicates.forEach(([route, files]) => {
    console.log(`  🔸 Route: ${route}`);
    files.forEach((f) => console.log(`     → ${f}`));
  });

  rl.question(
    "\nWould you like to delete the *older* duplicates automatically? (y/N): ",
    (answer) => {
      if (answer.toLowerCase() !== "y") {
        console.log("❎ No files deleted. Exiting.");
        rl.close();
        return;
      }

      duplicates.forEach(([_, files]) => {
        // Keep the most recently modified file
        const sorted = files.sort(
          (a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs
        );
        const [keep, ...remove] = sorted;

        console.log(`\n🛠 Keeping: ${keep}`);
        remove.forEach((f) => {
          console.log(`   🗑 Deleting: ${f}`);
          fs.rmSync(f);
        });
      });

      rl.close();
      console.log("\n✅ Cleanup complete. Run `npm run build` again.");
    }
  );
}

main();