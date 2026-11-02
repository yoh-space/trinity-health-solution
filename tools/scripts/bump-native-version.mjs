#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const appJsonPath = path.join(rootDir, "apps/native/app.json");
const nativePackageJsonPath = path.join(rootDir, "apps/native/package.json");

function parseSemVer(versionStr) {
  const clean = versionStr.replace(/^v/, "").trim();
  const parts = clean.split(".").map((n) => parseInt(n, 10));
  if (parts.length < 3 || parts.some(isNaN)) {
    throw new Error(`Invalid semver version: ${versionStr}`);
  }
  return { major: parts[0], minor: parts[1], patch: parts[2] };
}

function formatSemVer({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function calculateVersionCode({ major, minor, patch }, runNumber = 1) {
  // Encodes SemVer into an integer: Major * 10000 + Minor * 100 + Patch + offset
  const baseCode = major * 10000 + minor * 100 + patch;
  return Math.max(baseCode, parseInt(runNumber, 10) || 1);
}

function bump(currentVersion, type, explicitVersion) {
  if (explicitVersion) {
    return parseSemVer(explicitVersion);
  }
  const parsed = parseSemVer(currentVersion);
  switch (type) {
    case "major":
      return { major: parsed.major + 1, minor: 0, patch: 0 };
    case "minor":
      return { major: parsed.major, minor: parsed.minor + 1, patch: 0 };
    case "current":
      return parsed;
    case "patch":
    default:
      return { major: parsed.major, minor: parsed.minor, patch: parsed.patch + 1 };
  }
}

function main() {
  const args = process.argv.slice(2);
  const bumpType = args[0] || "patch";
  const explicitVersion = args[1] || "";
  const runNumber = process.env.GITHUB_RUN_NUMBER || "1";

  if (!fs.existsSync(appJsonPath) || !fs.existsSync(nativePackageJsonPath)) {
    console.error("Native app config files not found.");
    process.exit(1);
  }

  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
  const nativePkg = JSON.parse(fs.readFileSync(nativePackageJsonPath, "utf-8"));

  const currentVersion = appJson.expo?.version || nativePkg.version || "1.0.0";
  const nextSemVer = bump(currentVersion, bumpType, explicitVersion);
  const nextVersionStr = formatSemVer(nextSemVer);
  const nextVersionCode = calculateVersionCode(nextSemVer, runNumber);

  console.log(`Bumping native version from ${currentVersion} -> ${nextVersionStr} (versionCode: ${nextVersionCode})`);

  // Update app.json
  appJson.expo = appJson.expo || {};
  appJson.expo.version = nextVersionStr;
  appJson.expo.android = appJson.expo.android || {};
  appJson.expo.android.versionCode = nextVersionCode;
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n", "utf-8");

  // Update package.json
  nativePkg.version = nextVersionStr;
  fs.writeFileSync(nativePackageJsonPath, JSON.stringify(nativePkg, null, 2) + "\n", "utf-8");

  // Output for GitHub Actions workflow environment
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `VERSION=${nextVersionStr}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `VERSION_CODE=${nextVersionCode}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `TAG=v${nextVersionStr}\n`);
  }
}

main();
