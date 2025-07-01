// scripts/killPort.js
import { execSync } from 'child_process';

const PORT = 5050;

try {
  const output = execSync(`lsof -ti tcp:${PORT}`);
  const pids = output.toString().split('\n').filter(Boolean);

  if (pids.length === 0) {
    console.log(`✅ No process found using port ${PORT}`);
  } else {
    pids.forEach((pid) => {
      console.log(`🔪 Killing process on port ${PORT} (PID: ${pid})`);
      execSync(`kill -9 ${pid}`);
    });
    console.log(`✅ All processes on port ${PORT} have been killed.`);
  }
} catch (err) {
  console.log(`⚠️ Could not check or kill port ${PORT}. Make sure you're on macOS/Linux and 'lsof' is installed.`);
}
