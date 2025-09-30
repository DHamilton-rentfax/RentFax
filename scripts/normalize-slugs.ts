// scripts/normalize-slugs.ts
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");

function walk(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function collectAndRenameFolders(dir: string) {
    const foldersToRename: [string, string][] = [];

    function findFolders(currentDir: string) {
        fs.readdirSync(currentDir, { withFileTypes: true }).forEach((entry) => {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name.includes("[disputeId]") || entry.name.includes("[incidentId]")) {
                    foldersToRename.push([
                        fullPath,
                        path.join(currentDir, entry.name.replace(/\[(dispute|incident)Id\]/g, "[id]")),
                    ]);
                }
                findFolders(fullPath);
            }
        });
    }

    findFolders(dir);

    // Sort by path depth, descending, to rename deepest folders first
    foldersToRename.sort((a, b) => b[0].length - a[0].length);

    for (const [oldPath, newPath] of foldersToRename) {
        fs.renameSync(oldPath, newPath);
        console.log("Renamed:", oldPath, "→", newPath);
    }
}

// 🔄 Replace disputeId/incidentId → id inside code
function replaceInFile(file: string) {
  let contents = fs.readFileSync(file, "utf8");

  const patterns: [RegExp, string][] = [
    [/\\bdisputeId\\b/g, "id"],
    [/\\bincidentId\\b/g, "id"],
    [/(params:\\s*\\{)\\s*(disputeId|incidentId)\\s*:\\s*string\\s*(\\})/g, "$1 id: string $3"],
    [/useParams<\\{.*?(disputeId|incidentId): string \\}>/g, "useParams<{ id: string }>"],
    [/(disputes|incidents)\\/\\$\\{(disputeId|incidentId)\\}/g, "$1/${id}"],
  ];

  let updated = contents;
  patterns.forEach(([regex, replacement]) => {
    updated = updated.replace(regex, replacement);
  });

  if (updated !== contents) {
    fs.writeFileSync(file, updated, "utf8");
    console.log("Updated:", file);
  }
}

// 🚀 Run
collectAndRenameFolders(ROOT);
walk(ROOT, replaceInFile);
