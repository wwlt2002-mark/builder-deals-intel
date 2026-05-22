import { spawn } from "node:child_process";

const jobs = [
  ["expire", "node", ["scripts/expire-deals.mjs"]],
  ["ingest", "node", ["scripts/ingest-feeds.mjs"]],
  ["newsletter", "node", ["scripts/generate-newsletter.mjs"]]
];

function runJob([name, command, args]) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const child = spawn(command, args, {
      env: process.env,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

      if (code === 0) {
        console.log(`[daily-ops] ${name} completed in ${seconds}s.`);
        resolve();
        return;
      }

      reject(new Error(`[daily-ops] ${name} failed with exit code ${code}.`));
    });
  });
}

console.log(`[daily-ops] started at ${new Date().toISOString()}`);

for (const job of jobs) {
  await runJob(job);
}

console.log(`[daily-ops] completed at ${new Date().toISOString()}`);
