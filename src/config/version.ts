/**
 * Version metadata for Crimson Sanctum.
 *
 * Centralized here rather than read piecemeal from package.json so it
 * can carry fields package.json doesn't have (buildDate) and can be
 * imported directly into client code without bundling all of
 * package.json. Intended consumer: the hidden Legacy Vault easter egg.
 *
 * `buildDate` is a placeholder — wire it to an actual build-time value
 * (e.g. via a Vite `define` injecting `__BUILD_DATE__` at build time)
 * once the CI/deploy pipeline exists. Left as a literal for now rather
 * than `new Date()` at runtime, since that would show the visitor's
 * page-load time, not the actual build time.
 */

export interface VersionInfo {
  projectName: string;
  version: string;
  buildDate: string;
}

export const VERSION: VersionInfo = {
  projectName: 'Crimson Sanctum',
  version: '1.0.0',
  buildDate: 'PLACEHOLDER_BUILD_DATE',
};
