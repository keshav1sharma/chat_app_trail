import path from "path";

// A simpler path helper that doesn't rely on import.meta
export function getDirname() {
  // Just using path.resolve() works for both development and production on Vercel
  return path.resolve();
}
