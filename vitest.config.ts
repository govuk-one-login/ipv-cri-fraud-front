import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    include: ["src/**/*.test.js"],
    setupFiles: ["./test/utils/vi-helpers.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*"],
      exclude: ["**/*.njk", "**/*.md"],
    },
  },
});
