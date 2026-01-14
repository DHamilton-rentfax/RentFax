import fs from "fs";
import path from "path";

function findDirs(startPath: string): string[] {
  let result: string[] = [];
  try {
    for (const file of fs.readdirSync(startPath)) {
      const fullPath = path.join(startPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        result.push(fullPath);
        result = result.concat(findDirs(fullPath));
      }
    }
  } catch {
    // ignore
  }
  return result;
}

function normalizeRoutePath(dir: string, appDir: string): string {
  const relative = path.relative(appDir, dir).replace(/\\/g, "/");

  return (
    "/" +
    relative
      .replace(/\/\([^)]+\)/g, "") // remove route groups
      .replace(/\/@[^/]+/g, "") // remove parallel routes
      .split("/")
      .map((seg) => {
        if (seg.startsWith("[[...")) return "[...slug]";
        if (seg.startsWith("[...")) return "[...slug]";
        if (seg.startsWith("[")) return "[slug]";
        return seg;
      })
      .join("/")
  );
}

const appDir = path.join(process.cwd(), "src", "app");
const allDirs = findDirs(appDir);

const routeDirs = allDirs.filter((dir) => {
  try {
    const files = fs.readdirSync(dir);
    return files.some((file) =>
      /^(page|route|layout)\.(js|jsx|ts|tsx)$/.test(file)
    );
  } catch {
    return false;
  }
});

const routeMap = new Map<string, string[]>();

for (const dir of routeDirs) {
  const normalized = normalizeRoutePath(dir, appDir);
  if (!routeMap.has(normalized)) routeMap.set(normalized, []);
  routeMap.get(normalized)!.push(
    path.relative(process.cwd(), dir).replace(/\\/g, "/")
  );
}

const collisions = [...routeMap.entries()]
  .filter(([, dirs]) => dirs.length > 1)
  .map(([path, folders]) => ({ path, folders }));

if (collisions.length) {
  console.error("❌ Route collision detected:\n");
  for (const c of collisions) {
    console.error(`→ URL PATH: ${c.path}`);
    c.folders.forEach((f) => console.error(`   - ${f}`));
    console.error("");
  }
  process.exit(1);
}

console.log("✅ No route collisions found.");
