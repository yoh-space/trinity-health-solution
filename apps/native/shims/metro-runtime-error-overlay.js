/**
 * Shim for @expo/metro-runtime/error-overlay
 *
 * This subpath export was added in @expo/metro-runtime@6.x but the installed
 * version (55.0.x) uses a different package structure where the error overlay
 * lives inside @expo/log-box. This shim provides the expected export shape so
 * expo-router@6 can import it without crashing.
 *
 * Only imported in NODE_ENV !== 'production', so it has no effect in release.
 */

'use strict';

const React = require('react');

/**
 * withErrorOverlay — passes through the component unchanged on native.
 * The actual error overlay on native is handled by the native LogBox module.
 */
function withErrorOverlay(Component) {
  return Component;
}

module.exports = { withErrorOverlay };
