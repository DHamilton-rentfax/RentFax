
import { execSync } from "child_process";

try {
  execSync("npx next build", { stdio: "pipe" });
  console.log("✅ Routes OK");
} catch {
  console.error("❌ Route collision detected");
  process.exit(1);
}
