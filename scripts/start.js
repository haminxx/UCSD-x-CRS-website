/**
 * Production start entry for the repo root.
 *
 * On Render (RENDER=true), always run the recruitment chat-server — even if
 * the dashboard Root Directory was left blank and npm start hits the repo root.
 * Locally / elsewhere, run Next.js (`next start`).
 */
const { existsSync } = require("fs");
const { spawn, spawnSync } = require("child_process");
const path = require("path");

const isRender = process.env.RENDER === "true";

if (isRender) {
  const chatDir = path.join(__dirname, "..", "chat-server");
  const serverJs = path.join(chatDir, "server.js");

  if (!existsSync(serverJs)) {
    console.error(
      "[start] RENDER=true but chat-server/server.js is missing. Check the repo.",
    );
    process.exit(1);
  }

  if (!existsSync(path.join(chatDir, "node_modules"))) {
    console.log(
      "[start] chat-server/node_modules missing — running npm install in chat-server…",
    );
    const install = spawnSync("npm", ["install"], {
      cwd: chatDir,
      stdio: "inherit",
      shell: true,
      env: process.env,
    });
    if (install.status !== 0) {
      console.error("[start] npm install in chat-server failed");
      process.exit(install.status || 1);
    }
  }

  console.log("[start] RENDER=true — starting chat-server (not Next.js)");
  const child = spawn("node", ["server.js"], {
    cwd: chatDir,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
} else {
  const nextBin = path.join(
    __dirname,
    "..",
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const child = spawn(process.execPath, [nextBin, "start"], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
}
