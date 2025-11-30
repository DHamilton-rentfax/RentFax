/**
 * Report-only version of the route conflict script for CI/CD.
 * Exits with a non-zero exit code if duplicates are found.
 */

import fs from "fs";
import path from "path";

const appDir = path.resolve("src/app");
const routeGroups = new Set(["(app)", "(customer)", "(renter)", "(public)"]);

function normalizeRoute(filePath) {
  let route = filePath
    .replace(appDir, "")
    .replace(/page\.(js|jsx|ts|tsx)$/, "")
    .replace(/\[.*?\]/g, "[param]");

  routeGroups.forEach((group) => {
    route = route.replace(`/${group}`, "");
  });

  route = route.replace(/\/+/g, "/").replace(/\/$/, "");
  if (route === "") route = "/";
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

function main() {
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

  console.error("❌ ERROR: Found duplicate routes that resolve to the same path:\n");
  duplicates.forEach(([route, files]) => {
    console.error(`  🔸 Route: ${route}`);
    files.forEach((f) => console.error(`     → ${f}`));
  });

  console.error("\nCI build failed. Please run 'npm run cleanup:routes' locally to fix.");
  process.exit(1);
}

main();