const { exec } = require("child_process");
const net = require("net");

const port = 3000; // Force 3000 always

const server = net.createServer();

server.listen(port, "0.0.0.0", () => {
  server.close();

  // Always clean then run Next on 3000
  const child = exec(`npm run clean && next dev -p ${port} -H 0.0.0.0`, {
    env: {
      ...process.env,
      PORT: String(port),
    },
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n❌ Port ${port} is already in use.\n` +
        `Kill whatever is running on ${port} and try again.\n`
    );
    process.exit(1);
  } else {
    console.error(err);
    process.exit(1);
  }
});
