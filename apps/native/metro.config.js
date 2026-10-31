const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

// On Windows, drive letters can be lowercase or uppercase depending on how the
// shell was started (e.g. MinGW bash vs cmd vs PowerShell). Metro's internal
// RootPathUtils uses case-sensitive string matching for path resolution, which
// causes duplicate drive letters like "C:\c:\..." if casing differs.
// Using fs.realpathSync.native ensures canonical uppercase drive letters everywhere.
const projectRoot = fs.realpathSync.native(__dirname);
const monorepoRoot = fs.realpathSync.native(path.resolve(projectRoot, "..", ".."));

const config = getDefaultConfig(projectRoot);

// 1. Watch only the workspace packages that need hot-reloading, not the entire
// monorepo root. Watching the whole monorepo root on Windows without watchman
// causes Metro's file watcher to time out ("Failed to start watch mode") because
// it has to crawl too many files (node_modules, android/, ios/, .expo/, etc.).
//
// Module *resolution* from the monorepo root is already handled by
// nodeModulesPaths and extraNodeModules below, so watchFolders only needs to
// cover directories whose file changes should trigger a Metro reload.
config.watchFolders = [path.resolve(monorepoRoot, "packages", "backend")];

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
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@packages/backend": path.resolve(monorepoRoot, "packages", "backend"),
};

// 5. Redirect React for the `convex` package's react-clerk sub-package so it uses
// the app's React 19 instead of its bundled React 18. The `convex` npm package
// (v1.35.x) bundles its own `react` v18 in `node_modules/convex/node_modules/react`.
// When `ConvexProviderWithClerk` is rendered in the app's React 19 context, this
// causes "Invalid hook call" errors because the hook dispatcher resolves to the
// wrong React instance. By mapping the nested React to the app's React, we ensure
// a single React instance.
const convexNestedReact = path.resolve(
  monorepoRoot,
  "node_modules",
  "convex",
  "node_modules",
  "react"
);
const appReact = path.resolve(projectRoot, "node_modules", "react");
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@packages/backend": path.resolve(monorepoRoot, "packages", "backend"),
  [convexNestedReact]: appReact,
};

// 5. Custom resolver to intercept subpath imports that are missing from the
// hoisted package versions (version skew between expo-router@6 and the
// installed @expo/metro-runtime@55.x).
//
// @expo/metro-runtime/error-overlay: added in @expo/metro-runtime@6.x but
// the hoisted version is 55.0.x. On native, LogBox handles error overlays
// natively so this shim is a safe no-op passthrough.
const shimDir = path.resolve(projectRoot, "shims");
const SHIMS = {
  "@expo/metro-runtime/error-overlay": path.join(
    shimDir,
    "metro-runtime-error-overlay.js"
  ),
};

const ENTRY_REGEX = /(^|[\/\\])(node_modules[\/\\])?expo-router[\/\\]entry(\.js)?$/;

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (SHIMS[moduleName]) {
    return { filePath: SHIMS[moduleName], type: "sourceFile" };
  }
  // When building for release with Gradle in a monorepo, the React Native
  // Gradle plugin resolves entryFile relative to apps/native (e.g.
  // ./../../node_modules/expo-router/entry.js), but Metro's server root is the
  // monorepo root. We intercept only the exact entry module (not entry-classic)
  // and redirect it to the actual file in monorepoRoot.
  if (ENTRY_REGEX.test(moduleName)) {
    return {
      filePath: path.resolve(monorepoRoot, "node_modules", "expo-router", "entry.js"),
      type: "sourceFile",
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
