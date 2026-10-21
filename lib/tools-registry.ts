import { GENERATED_TOOLS } from './tools-registry.generated';

export interface ToolDef {
  slug: string;
  name: string;
  category: string;
  keywords: string[];
  component: () => Promise<{ default: React.ComponentType<any> }>;
  props?: Record<string, unknown>;
}

// Hand-written, unique tools live here. Everything generated from
// data/tool-specs.json lives in tools-registry.generated.ts.
export const MANUAL_TOOLS: ToolDef[] = [
  // {
  //   slug: 'my-custom-tool',
  //   name: 'My Custom Tool',
  //   category: 'Misc',
  //   keywords: ['custom'],
  //   component: () => import('@/components/tools/MyCustomTool'),
  // },
];

export const TOOLS: ToolDef[] = [...MANUAL_TOOLS, ...GENERATED_TOOLS];

export function findTool(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
