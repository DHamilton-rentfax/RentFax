// scripts/renameFraudScore.ts
// (temporary script — delete after running)

import fs from "fs";
import glob from "glob";

glob("src/**/*.{ts,tsx}", (_, files) => {
  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    const updated = content
      .replace(/fraudScore/gi, "behaviorScore")
      .replace(/Fraud Score/gi, "Behavior Score")
      .replace(/fraud score/gi, "behavior score");

    if (content !== updated) {
      fs.writeFileSync(file, updated, "utf8");
      console.log("Updated:", file);
    }
  }
});
