import fs from "fs";

console.log("🔍 Running Next.js build sanity check...\n");

const config = fs.readFileSync("./next.config.js", "utf8");

if (!config.includes("asyncWebAssembly: true")) {
  console.error("❌ Missing asyncWebAssembly flag in next.config.js");
  process.exit(1);
}

if (!config.includes("type: \"webassembly/async\"")) {
  console.error("❌ Missing WASM loader rule in next.config.js");
  process.exit(1);
}

if (!fs.existsSync("./src/firebase/client.ts")) {
  console.error("❌ Missing Firebase client.ts file.");
  process.exit(1);
}

console.log("✅ All checks passed — ready for build!");
