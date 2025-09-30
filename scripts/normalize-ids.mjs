
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PATH = path.resolve(__dirname, '../src/app');

async function renameDynamicRouteDirs(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '[disputeId]' || entry.name === '[incidentId]') {
          const newPath = path.join(dirPath, '[id]');
          try {
            await fs.rename(fullPath, newPath);
            console.log(`✅ Renamed directory: ${fullPath} -> ${newPath}`);
            await renameDynamicRouteDirs(newPath);
          } catch (renameError) {
            console.error(`❌ Error renaming directory ${fullPath}:`, renameError);
          }
        } else {
          await renameDynamicRouteDirs(fullPath);
        }
      }
    }
  } catch (readdirError) {
    // Ignore errors for directories that might not exist
    if (readdirError.code !== 'ENOENT') {
      console.error(`❌ Error reading directory ${dirPath}:`, readdirError);
    }
  }
}

async function updateFileContents(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    const originalContent = content;

    content = content
      .replace(/\b(dispute|incident)Id\b/g, 'id')
      .replace(/useParams<\{[^}]+(dispute|incident)Id[^}]+}>/g, 'useParams<{ id: string }>')
      .replace(/params:\s*\{\s*(dispute|incident)Id:\s*string\s*\}/g, 'params: { id: string }')
      .replace(/\/(disputes|incidents)\/\$\{(dispute|incident)Id\}/g, '/$1/\${id}');

    if (content !== originalContent) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`📝 Updated content in: ${filePath}`);
    }
  } catch (fileError) {
    console.error(`❌ Error processing file ${filePath}:`, fileError);
  }
}

async function walkDirAndUpdate(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await walkDirAndUpdate(fullPath);
      } else if (entry.isFile()) {
        await updateFileContents(fullPath);
      }
    }
  } catch (walkError) {
    if (walkError.code !== 'ENOENT') {
      console.error(`❌ Error walking directory ${dirPath}:`, walkError);
    }
  }
}

async function main() {
  try {
    console.log('--- 🚀 Starting Codemod Script ---');

    console.log('\nStep 1: Renaming dynamic route directories...');
    await renameDynamicRouteDirs(SRC_PATH);

    console.log('\nStep 2: Updating references in file contents...');
    await walkDirAndUpdate(SRC_PATH);

    console.log('\n--- ✅ Codemod script finished successfully! ---');
    console.log('Run `grep -R "disputeId" src/` and `grep -R "incidentId" src/` to verify.');
    console.log('You can now run the script with: node scripts/normalize-ids.mjs');

  } catch (error) {
    console.error('❌ An unexpected error occurred:', error);
  }
}

main();
