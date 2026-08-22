/**
 * Ambient module declarations for GLSL shader imports.
 *
 * Not wired to a bundler plugin yet — when shaders are actually needed
 * (custom materials in the Hero or Hall of Achievement scenes), add
 * `vite-plugin-glsl` (or similar) to vite.config.ts. This file just
 * ensures TypeScript doesn't error on the import path in the meantime.
 */
declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.vert' {
  const value: string;
  export default value;
}

declare module '*.frag' {
  const value: string;
  export default value;
}
