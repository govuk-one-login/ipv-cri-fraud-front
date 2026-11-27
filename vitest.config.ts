import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    include: ["src/**/*.test.js"],
    setupFiles: ["./test/utils/vi-helpers.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.js"],
      exclude: [
        "**/*.test.js",
        "src/**/fields.js",
        "src/**/steps.js",
        "src/app.js",
        "src/router.js",
        "src/dynamo-session-config.js",
        "src/lib/config.js"
      ]
    }
  }
});
