import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The admin dashboard hydrates the session from localStorage and fetches
      // data on mount — standard, intentional patterns (mirrors the reference
      // app). This aggressive rule flags them, so it's disabled project-wide.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Turn off rules that conflict with Prettier; keep Prettier last.
  prettier,
  globalIgnores([
    ".next/**",
    ".next-admin/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
