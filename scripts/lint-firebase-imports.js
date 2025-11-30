#!/usr/bin/env node
import fs from "fs";
import path from "path";

// A simple solution to get the project root.
// This might need adjustment depending on your project structure.
const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

function scanFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}. Skipping scan.`);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Skip node_modules
    if (fullPath.includes("node_modules")) {
      continue;
    }

    if (stat.isDirectory()) {
      scanFiles(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("@/lib/firebase")) {
        console.error(`❌ Blocked commit: Found invalid import in ${fullPath}`);
        console.error(`   Use "@/firebase/client" or "@/firebase/server" instead of "@/lib/firebase"`);
        process.exit(1);
      }
    }
  }
}

scanFiles(srcDir);
console.log("✅ Firebase import paths are clean!");
