import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)));
const envFile = resolve(packageDirectory, ".env.local");
let deployment = process.env.CONVEX_DEPLOYMENT;

if (!deployment) {
  try {
    const envText = readFileSync(envFile, "utf8");
    const match = envText.match(
      /^\s*CONVEX_DEPLOYMENT\s*=\s*["']?([^\s"']+)["']?\s*$/m,
    );
    deployment = match?.[1];
  } catch {
    // The actionable setup message below covers a missing local config file.
  }
}

if (!deployment || !/^dev:[A-Za-z0-9_-]+$/.test(deployment)) {
  console.error(
    "Refusing to seed: set CONVEX_DEPLOYMENT to your project's dev deployment (dev:<name>) or run Convex dev setup first. Production and local-only targets are not accepted by this script.",
  );
  process.exit(1);
}

console.log(
  `Seeding education content on dev deployment ${deployment} (no production target).`,
);
const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(
  command,
  [
    "exec",
    "convex",
    "run",
    "seed:seedEducation",
    "{}",
    "--deployment",
    deployment,
    "--push",
  ],
  {
    cwd: packageDirectory,
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

if (result.error) {
  console.error(`Could not start Convex CLI: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
