#!/usr/bin/env node
/**
 * Prevents accidental use of "@/lib/firebase" imports.
 * Scans all TypeScript/JavaScript source files and fails if found.
 */

import fs from "fs";
import path from "path";

const SRC_DIR = "src";
let badFiles = [];

function scanDir(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.match(/@\/lib\/firebase/)) {
        badFiles.push(fullPath);
      }
    }
  }
}

scanDir(SRC_DIR);

if (badFiles.length > 0) {
  console.error("\n❌ Found invalid Firebase imports:");
  badFiles.forEach((f) => console.error(` - ${f}`));
  console.error("\n👉 Use '@/firebase/client' or '@/firebase/server' instead of '@/lib/firebase'.\n");
  process.exit(1);
}

console.log("✅ Firebase imports look good!");
