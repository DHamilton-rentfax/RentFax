/* scripts/check-next-routes.cjs
 *
 * Prevent Next.js App Router route collisions caused by route groups (folders in parentheses).
 * - Disallows page.tsx directly inside a (route-group) folder
 * - Detects two pages resolving to the same URL (after stripping route groups)
 */

const fs = require("fs");
const path = require("path");

const SRC_APP = path.join(process.cwd(), "src", "app");
const ROOT_APP = path.join(process.cwd(), "app");

// 🔔 Regression guard — root /app should never exist
if (fs.existsSync(ROOT_APP)) {
  console.warn(
    "⚠️  Root /app directory detected.\n" +
    "   This project uses src/app exclusively.\n" +
    "   Root /app can shadow routes and cause 404s."
  );
}

// Prefer src/app, fall back only if explicitly present
const APP_DIR = fs.existsSync(SRC_APP)
  ? SRC_APP
  : fs.existsSync(ROOT_APP)
  ? ROOT_APP
  : null;

if (!APP_DIR) {
  console.warn("⚠️ No app directory found (expected src/app). Skipping route check.");
  process.exit(0);
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function rel(p) {
  return p.replace(process.cwd() + path.sep, "");
}

// Remove route groups "(...)" from a path
function stripRouteGroups(segments) {
  return segments.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
}

// Build URL from a page.tsx file path
function pageFileToRoute(filePath) {
  const relPath = path.relative(APP_DIR, filePath);
  const parts = relPath.split(path.sep);

  // Drop "page.tsx"
  parts.pop();

  // Strip route groups
  const cleaned = stripRouteGroups(parts);

  const url = "/" + cleaned.join("/");
  return url === "/" ? "/" : url.replace(/\/+/g, "/").replace(/\/$/, "");
}

function main() {
  if (!isDir(APP_DIR)) {
    console.error(`❌ Could not find app directory at: ${APP_DIR}`);
    process.exit(1);
  }

  const files = walk(APP_DIR);
  const pageFiles = files.filter((f) => /page\.(ts|tsx|js|jsx)$/.test(f));
  const errors = [];

  // Rule 1: No page.tsx directly inside a (route-group)
  for (const f of pageFiles) {
    const relPath = path.relative(APP_DIR, f);
    const parts = relPath.split(path.sep);
    if (
      parts.length >= 2 &&
      parts[0].startsWith("(") &&
      parts[0].endsWith(")") &&
      /^page\./.test(parts[1])
    ) {
      errors.push(
        `Route-group page not allowed: ${rel(f)}\n` +
          `  Fix: move it into a real subfolder: src/app/${parts[0]}/<route>/page.tsx`
      );
    }
  }

  // Rule 2: Detect duplicate resolved routes
  const routeMap = new Map();
  for (const f of pageFiles) {
    const route = pageFileToRoute(f);
    const arr = routeMap.get(route) || [];
    arr.push(f);
    routeMap.set(route, arr);
  }

  for (const [route, filesForRoute] of routeMap.entries()) {
    if (filesForRoute.length > 1) {
      errors.push(
        `Duplicate route: "${route}" resolves from:\n` +
          filesForRoute.map((x) => `  - ${rel(x)}`).join("\n") +
          `\n  Fix: ensure each page has a unique real path segment (folders NOT in parentheses).`
      );
    }
  }

  if (errors.length) {
    console.error("\n❌ Next.js route validation failed:\n");
    for (const e of errors) {
      console.error("— " + e + "\n");
    }
    process.exit(1);
  }

  console.log("✅ Next.js routes look good (no route-group pages, no collisions).");
}

main();
