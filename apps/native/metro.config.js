// Force the Metro server root to the app directory (apps/native) instead of the
// monorepo root. This lets Metro resolve hoisted dependencies (e.g. expo-router)
// that live in the root node_modules of this pnpm workspace.
process.env.EXPO_NO_METRO_WORKSPACE_ROOT = "true";

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const monorepoRoot = path.resolve(__dirname, "..", "..");
const config = getDefaultConfig(__dirname);

// Tell Metro to watch the monorepo root so it can access workspace packages
// (e.g. packages/backend) and hoisted node_modules that live outside apps/native.
config.watchFolders = [monorepoRoot];

// Let Metro find hoisted dependencies in the monorepo root node_modules
// in addition to apps/native/node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Resolve the @packages/backend workspace package via its real directory so
// Metro can resolve deep subpaths such as
// @packages/backend/convex/_generated/api that fail when the package is only
// reachable through a symlinked node_modules entry.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@packages/backend": path.resolve(monorepoRoot, "packages", "backend"),
};

module.exports = config;
