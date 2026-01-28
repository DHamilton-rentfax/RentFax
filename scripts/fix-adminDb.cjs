const fs = require("fs");

const files = fs.readFileSync("/tmp/adminDb-files.txt", "utf8")
  .split("\n")
  .filter(Boolean);

for (const file of files) {
  let code = fs.readFileSync(file, "utf8");

  // Skip if already fixed
  if (code.includes("getAdminDb()")) continue;

  // Find first exported function or route handler
  const match = code.match(
    /(export\s+(async\s+)?function\s+[^(]+\([^)]*\)\s*\{)|(export\s+async\s+function\s+POST\s*\([^)]*\)\s*\{)/
  );

  if (!match) {
    console.warn(`⚠️  Skipped (no export fn): ${file}`);
    continue;
  }

  const insertAt = match.index + match[0].length;

  const injection = `
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }
`;

  code =
    code.slice(0, insertAt) +
    injection +
    code.slice(insertAt);

  fs.writeFileSync(file, code);
  console.log(`✅ Fixed: ${file}`);
}

console.log("🎉 Done");
