import { defineConfig, Rollup, UserConfig } from "vite";

export const defaultConfig: UserConfig = {
  plugins: [],
  clearScreen: false,
  appType: "mpa",
  build: {
    chunkSizeWarningLimit: 10000,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      onwarn(warning: Rollup.RollupLog, defaultHandler: (warning: string | Rollup.RollupLog) => void) {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
};

export default defineConfig(({ mode }) => {
  return {
    ...defaultConfig,
    base: "",
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
      keepNames: true,
    },
    server: {
      port: 4567,
    },
  };
});
