/**
 * restore-searchparams.js
 * ---------------------------------------------------------
 * This script reverses the fixes from fix-searchparams.js
 * It changes:
 *     React.use(searchParams).something  -->  searchParams.something
 * and removes the added import if it’s not used elsewhere.
 */

import fs from "fs";
import path from "path";

const targetDir = path.resolve("src/app");

function getAllFiles(dir, ext = ".tsx") {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    try {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) files = files.concat(getAllFiles(fullPath, ext));
      else if (file.endsWith(ext)) files.push(fullPath);
    } catch (e) {
      console.error(`Could not stat file ${fullPath}: ${e}`);
    }
  });
  return files;
}

function restoreFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Only process files that contain React.use(searchParams)
  if (!content.includes("React.use(searchParams)")) return;

  // Step 1: Replace React.use(searchParams).prop → searchParams.prop
  const regex = /React\.use\(searchParams\)\.([a-zA-Z0-9_]+)/g;
  let newContent = content.replace(regex, "searchParams.$1");

  // Step 2: Remove unused React import if it’s only our inserted line
  if (
    newContent.includes('import * as React from "react";') &&
    !newContent.includes("React.")
  ) {
    newContent = newContent.replace('import * as React from "react";\n', "");
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`♻️ Restored: ${filePath}`);
}

const files = getAllFiles(targetDir);
console.log(`🔍 Scanning ${files.length} .tsx files for restore...`);
files.forEach(restoreFile);
console.log("\n✅ Done! All React.use(searchParams) calls reverted to original form.");
