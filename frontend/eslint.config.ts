import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import {defineConfig} from "eslint/config";
import {fileURLToPath} from "node:url";
import path from "node:path";
import eslintConfigPrettier from "eslint-config-prettier";

const __dirname = path.dirname(fileURLToPath(new URL(".", import.meta.url)));

export default defineConfig([
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
                project: ["./tsconfig.node.json", "./tsconfig.app.json"],
                tsconfigRootDir: __dirname
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            react
        },
        rules: {
            "react/react-in-jsx-scope": "off"
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            react.configs.flat.recommended,
            eslintConfigPrettier
        ],
        settings: {
            react: { version: "detect" }
        }
    }
]);