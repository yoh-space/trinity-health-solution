// Force the Metro server root to the app directory (apps/native) instead of the
// monorepo root. This lets Metro resolve hoisted dependencies (e.g. expo-router)
// that live in the root node_modules of this pnpm workspace.
process.env.EXPO_NO_METRO_WORKSPACE_ROOT = "true";

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Resolve the @packages/backend workspace package via its real directory so
// Metro can resolve deep subpaths such as
// @packages/backend/convex/_generated/api that fail when the package is only
// reachable through a symlinked node_modules entry.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@packages/backend": path.resolve(__dirname, "..", "..", "packages", "backend"),
};

module.exports = config;
