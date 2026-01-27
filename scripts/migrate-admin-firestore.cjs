const fs = require("fs");
const path = require("path");

const ROOTS = [
  "src/app/api",
  "src/actions",
  "src/server-actions",
  "src/functions",
  "src/scripts",
];

function walk(dir) {
  if (!fs.existsSync(dir)) {
    // console.warn(`Directory not found, skipping: ${dir}`);
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith(".ts") || full.endsWith(".tsx")) {
      fixFile(full);
    }
  }
}

function fixFile(file) {
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("firebase/firestore")) return;

  const originalSrc = src;

  // Remove all variants of firestore client import
  src = src.replace(/import\s+\{[^}]*\}\s+from\s+["']firebase\/firestore["'];?/g, "");

  let importsAdded = false;
  // Add admin imports if they don't exist
  if (!originalSrc.includes('@/firebase/server')) {
      src = `import { adminDb } from "@/firebase/server";\n` + src;
      importsAdded = true;
  }
  if (!originalSrc.includes('firebase-admin/firestore')) {
      src = `import { FieldValue } from "firebase-admin/firestore";\n` + src;
      importsAdded = true;
  }

  // Add a newline after imports if we added any
  if (importsAdded) {
      src = src.replace(/(\n\s*import)/, "\n$1"); // Add space after new imports
  }

  // Replace Timestamps
  src = src
    .replace(/serverTimestamp\(\)/g, "FieldValue.serverTimestamp()")
    .replace(/Timestamp\.now\(\)/g, "FieldValue.serverTimestamp()");

  fs.writeFileSync(file, src);
  console.log(`✔ Fixed: ${file}`);
}

console.log("🔥 Starting Admin Firestore migration...");
ROOTS.forEach(walk);
console.log("✅ Admin Firestore migration script finished.");
