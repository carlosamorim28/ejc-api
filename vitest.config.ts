import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    // Integration tests share one database and truncate it between cases,
    // so test files must not run concurrently.
    fileParallelism: false,
    // Load .env (DATABASE_URL, etc.) into process.env for tests.
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
