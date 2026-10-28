const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..", "..");

const config = getDefaultConfig(projectRoot);

// 1. Tell Metro to watch the monorepo root so it can access workspace packages
// (e.g. packages/backend) and hoisted node_modules outside apps/native.
config.watchFolders = [monorepoRoot];

// 2. Let Metro find hoisted dependencies in the monorepo root node_modules
// in addition to apps/native/node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Resolve the @packages/backend workspace package via its real directory so
// Metro can resolve deep subpaths such as
// @packages/backend/convex/_generated/api that fail when the package is only
// reachable through a symlinked node_modules entry.
//
// 4. Shim @expo/metro-runtime/error-overlay — this subpath was added in
// @expo/metro-runtime@6.x but the hoisted version is 55.0.x which predates
// that export. The shim is a no-op on native (LogBox handles overlays natively)
// and is only imported in development mode.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@packages/backend": path.resolve(monorepoRoot, "packages", "backend"),
  "@expo/metro-runtime/error-overlay": path.resolve(
    projectRoot,
    "shims",
    "metro-runtime-error-overlay.js"
  ),
};

module.exports = config;
