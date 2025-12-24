const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(process.cwd(), "src/app");

const ROUTE_FILES = new Set([
  "page.tsx",
  "page.ts",
  "route.ts",
]);

function walk(dir, urlPath = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Route groups (ignored in URL)
      const isGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      const nextUrl = isGroup ? urlPath : path.join(urlPath, entry.name);
      walk(fullPath, nextUrl);
    }

    if (entry.isFile() && ROUTE_FILES.has(entry.name)) {
      const route = urlPath.replace(/\\/g, "/") || "/";
      console.log("ROUTE:", route);
    }
  }
}

console.log("Detected App Routes:\n");
walk(APP_DIR);
