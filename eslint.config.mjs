import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/* ------------------------------------------------------------------ */
/* ToolGlobe custom rule plugin                                        */
/* ------------------------------------------------------------------ */
const CLIENT_API_PATTERN =
  /\b(useState|useEffect|useLayoutEffect|useRef|useTransition|useReducer|useContext|useRouter|usePathname|useSearchParams|useId)\b/;

const toolglobePlugin = {
  rules: {
    "use-client-directive-position": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Files using React hooks or Next.js client-only APIs must declare 'use client' as line 1, column 1.",
        },
        schema: [],
        messages: {
          missingDirective:
            'This file uses a client-only API ("{{api}}") but is missing the "use client" directive at line 1, column 1.',
          misplacedDirective:
            'The "use client" directive must be the very first statement in the file. Found at line {{line}}.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const sourceCode = context.sourceCode ?? context.getSourceCode();
            const text = sourceCode.getText();
            const match = text.match(CLIENT_API_PATTERN);
            if (!match) return;

            const first = node.body[0];
            const hasDirective =
              first &&
              first.type === "ExpressionStatement" &&
              first.expression.type === "Literal" &&
              first.expression.value === "use client";

            if (!hasDirective) {
              context.report({
                node,
                messageId: "missingDirective",
                data: { api: match[0] },
              });
              return;
            }

            if (first.range[0] !== 0) {
              context.report({
                node: first,
                messageId: "misplacedDirective",
                data: { line: first.loc.start.line },
              });
            }
          },
        };
      },
    },

    "no-banned-registry-path": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          banned:
            'Banned import path "{{path}}" — always import the registry from "@/lib/tool-registry" (singular). "tools-registry" is forbidden.',
        },
      },
      create(context) {
        const check = (node, value) => {
          if (typeof value === "string" && /tools-registry/.test(value)) {
            context.report({ node, messageId: "banned", data: { path: value } });
          }
        };
        return {
          ImportDeclaration(node) {
            check(node.source, node.source.value);
          },
          CallExpression(node) {
            const isDynamicImportOrRequire =
              node.callee.type === "Import" ||
              (node.callee.type === "Identifier" && node.callee.name === "require");
            if (!isDynamicImportOrRequire) return;
            const arg = node.arguments[0];
            if (arg?.type === "Literal") check(arg, arg.value);
          },
        };
      },
    },

    "no-legacy-metadata-path": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          legacy:
            "buildPageMetadata received a legacy `path` property. Use `pathSegments: string[]` per the PageMetadataInput contract.",
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            const callee = node.callee;
            const calleeName =
              callee.type === "Identifier"
                ? callee.name
                : callee.type === "MemberExpression" &&
                  callee.property.type === "Identifier"
                ? callee.property.name
                : null;
            if (calleeName !== "buildPageMetadata") return;

            const arg = node.arguments[0];
            if (arg?.type !== "ObjectExpression") return;

            const legacyProp = arg.properties.find(
              (p) =>
                p.type === "Property" &&
                ((p.key.type === "Identifier" && p.key.name === "path") ||
                  (p.key.type === "Literal" && p.key.value === "path"))
            );
            if (legacyProp) {
              context.report({ node: legacyProp, messageId: "legacy" });
            }
          },
        };
      },
    },

    "default-export-only": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          named: "This file must use a default export only — named exports are banned here per ToolGlobe architecture.",
        },
      },
      create(context) {
        return {
          ExportNamedDeclaration(node) {
            context.report({ node, messageId: "named" });
          },
        };
      },
    },

    "named-export-only": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          default: "This file must use named exports only — default exports are banned here per ToolGlobe architecture.",
        },
      },
      create(context) {
        return {
          ExportDefaultDeclaration(node) {
            context.report({ node, messageId: "default" });
          },
        };
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/* File groups bound to the import/export contract                     */
/* ------------------------------------------------------------------ */
const DEFAULT_EXPORT_ONLY_FILES = [
  "components/search/SearchBar.tsx",
  "components/tools/FieldRenderer.tsx",
  "components/tools/ToolResultPanel.tsx",
  "components/tools/FaqAccordion.tsx",
  "components/tools/RelatedToolsList.tsx",
  "components/tools/ToolBreadcrumbs.tsx",
  "components/tools/ToolJsonLd.tsx",
];

const NAMED_EXPORT_ONLY_FILES = [
  "components/layout/header.tsx",
  "components/layout/footer.tsx",
  "components/layout/sidebar.tsx",
  "components/layout/category-nav.tsx",
  "components/ads/ad-slot.tsx",
  "lib/**/*.ts",
];

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { toolglobe: toolglobePlugin, import: importPlugin },
    files: ["**/*.{ts,tsx}"],
    rules: {
      "toolglobe/use-client-directive-position": "error",
      "toolglobe/no-banned-registry-path": "error",
      "toolglobe/no-legacy-metadata-path": "error",
      "import/no-duplicates": "error",
    },
  },
  {
    plugins: { toolglobe: toolglobePlugin },
    files: DEFAULT_EXPORT_ONLY_FILES,
    rules: { "toolglobe/default-export-only": "error" },
  },
  {
    plugins: { toolglobe: toolglobePlugin },
    files: NAMED_EXPORT_ONLY_FILES,
    rules: { "toolglobe/named-export-only": "error" },
  },
];

export default eslintConfig;
