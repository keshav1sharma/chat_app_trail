import path from "path";
import { fileURLToPath } from "url";

// This helps with ES modules vs CommonJS path resolution
export function getDirname() {
  // For ESM compatibility
  try {
    const __filename = fileURLToPath(import.meta.url);
    return path.dirname(__filename);
  } catch (e) {
    // For CommonJS fallback
    return path.resolve();
  }
}
