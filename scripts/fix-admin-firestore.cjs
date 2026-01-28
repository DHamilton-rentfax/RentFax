
/**
 * Automatic Fix Script for Firestore Admin in Next.js API Routes
 *
 * This script:
 * - Scans all files in src/app/api/
 * - Replaces db.collection() with adminDb.collection()
 * - Injects import { adminDb } from "@/firebase/server"
 * - Removes incorrect Firebase imports (firebase/firestore, getFirestore)
 * - Does NOT touch /functions directory or client components
 */

const fs = require("fs");
const path = require("path");

const apiRoot = path.join(process.cwd(), "src", "app", "api");

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      // Skip forbidden directories
      if (filepath.includes("functions")) return;
      filelist = walk(filepath, filelist);
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        filelist.push(filepath);
      }
    }
  });

  return filelist;
}

function fixFile(filepath) {
  let code = fs.readFileSync(filepath, "utf8");
  const originalCode = code;

  // Skip Cloud Functions safety
  if (code.includes("exports.") || code.includes("functions.config")) {
    return;
  }

  // Only modify server routes
  if (!filepath.includes("/app/api/")) return;

  let changed = false;

  // Replace db.collection → adminDb.collection
  const dbRegex = /db\.(collection|doc|batch)/g;
  if (dbRegex.test(code)) {
    code = code.replace(dbRegex, "adminDb.$1");
    changed = true;
  }

  // Remove incorrect Firestore imports
  const oldImports = [
    /import\s*\{[^}]*getFirestore[^}]*\}[^;]*;/g,
    /import\s*firebase[^;]*;/g,
    /import\s*\{[^}]*firestore[^}]*\}[^;]*;/g,
    /const\s+db\s*=\s*getFirestore\([^)]*\);?/g,
    /const\s+db\s*=\s*firebase\.firestore\(\);?/g,
  ];

  oldImports.forEach(regex => {
      if(regex.test(code)){
          code = code.replace(regex, "");
          changed = true;
      }
  });
  

  // Inject adminDb import if db was used and import is missing
  if (changed && !code.includes('from "@/firebase/server"')) {
    const importLine = `import { getAdminDb } from "@/firebase/server";\n`;
    code = importLine + code;
    changed = true;
  }

  // Write file only if changes occurred
  if (changed) {
    console.log("Fixing:", filepath);
    fs.writeFileSync(filepath, code, "utf8");
  }
}

function run() {
  console.log("🔍 Scanning API routes...");
  const allFiles = walk(apiRoot);

  allFiles.forEach((file) => fixFile(file));

  console.log("\n✅ Firestore Admin auto-fix complete!");
  console.log("Only Next.js API routes were modified.\n");
}

run();
