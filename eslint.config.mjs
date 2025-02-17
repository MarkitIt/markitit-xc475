import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Export a single configuration object
export default [
  {
    // Spread the extended configs
    ...compat.extends("next/core-web-vitals", "next/typescript", 'prettier')[0],
    // Add your rules
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
];
