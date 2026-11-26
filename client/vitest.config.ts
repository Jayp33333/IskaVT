import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test config: deliberately does NOT extend vite.config.ts, which
// loads the PWA plugin and shells out to `git rev-parse` at load time.
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_BUILD_ID__: JSON.stringify("test"),
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
