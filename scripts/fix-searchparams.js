/**
 * fix-searchparams.js
 * Auto-fix for Next.js 15 `searchParams` React.use() requirement
 * -------------------------------------------------------------
 * This scans all .tsx files in /src/app and automatically rewrites:
 *     searchParams.something  -->  React.use(searchParams).something
 * Adds `import * as React from "react";` if missing.
 */

import fs from "fs";
import path from "path";

const targetDir = path.resolve("src/app");

// Utility: recursively walk through directories
function getAllFiles(dir, ext = ".tsx") {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) files = files.concat(getAllFiles(fullPath, ext));
      else if (file.endsWith(ext)) files.push(fullPath);
    } catch (e) {
      console.error(`Could not stat file ${fullPath}: ${e}`);
    }
  });
  return files;
}

// Fixer logic
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Only touch files that reference searchParams
  if (!content.includes("searchParams")) return;

  // Step 1: Replace searchParams.prop → React.use(searchParams).prop
  const regex = /searchParams\.([a-zA-Z0-9_]+)/g;
  const newContent = content.replace(regex, "React.use(searchParams).$1");

  // Step 2: Add React import if missing
  let finalContent = newContent;
  if (!newContent.includes('import * as React from "react"')) {
    finalContent = 'import * as React from "react";\n' + newContent;
  }

  // Write changes
  fs.writeFileSync(filePath, finalContent, "utf8");
  console.log(`✅ Fixed: ${filePath}`);
}

// Run
try {
    const files = getAllFiles(targetDir);
    console.log(`🔍 Scanning ${files.length} .tsx files for searchParams usage...`);
    files.forEach(fixFile);
    console.log("\n🎉 Done! All searchParams references are now Next.js 15 safe.");
} catch (e) {
    console.error(`Could not read target directory ${targetDir}: ${e}`);
}
