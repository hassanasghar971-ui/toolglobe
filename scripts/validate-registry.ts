import { getAllTools, getAllCategories } from "@/lib/tool-registry";
import { validateRegistryIntegrity } from "@/lib/tool-registry/validate";

const tools = getAllTools();
const categories = getAllCategories();

const result = validateRegistryIntegrity(tools, categories);

if (!result.valid) {
  console.error("❌ Registry validation failed:\n");
  result.errors.forEach((e) => console.error(` - ${e}`));
  process.exit(1);
}

console.log(
  `✅ Registry valid — ${tools.length} tools across ${categories.length} categories.`
);
process.exit(0);
