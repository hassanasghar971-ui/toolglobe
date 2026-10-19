// lib/fuzzy-search.ts
import { getAllTools } from "@/lib/tool-registry";
import { getCategoryBySlug } from "@/lib/categories";
import type { ToolDefinition } from "@/lib/types/tool";

/**
 * Zero-dependency fuzzy search engine — see Phase 5 intro note for why
 * this replaces the originally-planned fuse.js dependency. Weighted
 * prefix/substring/subsequence matching, fully auditable, <2KB.
 */

export interface SearchableTool {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string;
  tags: string[];
  path: string;
}

export interface SearchResult {
  tool: SearchableTool;
  score: number;
}

export interface SearchOptions {
  categorySlug?: string;
  limit?: number;
}

let cachedIndex: SearchableTool[] | null = null;

function buildIndex(): SearchableTool[] {
  return getAllTools().map((tool: ToolDefinition) => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    categorySlug: tool.categorySlug,
    categoryName: getCategoryBySlug(tool.categorySlug)?.name ?? tool.categorySlug,
    shortDescription: tool.shortDescription,
    tags: tool.tags,
    path: `/${tool.categorySlug}/${tool.slug}`,
  }));
}

export function getSearchIndex(): SearchableTool[] {
  if (!cachedIndex) {
    cachedIndex = buildIndex();
  }
  return cachedIndex;
}

/**
 * Scores how well `query` matches `target`:
 *  - exact match: 100
 *  - prefix match: ~80-90
 *  - substring match: ~55-70
 *  - in-order subsequence match: 10-40 depending on compactness
 *  - no match at all: 0
 */
function scoreField(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  if (q === t) return 100;
  if (t.startsWith(q)) return 90 - Math.min(10, t.length - q.length);
  if (t.includes(q)) return 70 - Math.min(15, t.indexOf(q));

  // Subsequence check: every character of q appears in order within t.
  let qi = 0;
  let firstMatchIndex = -1;
  let lastMatchIndex = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (firstMatchIndex === -1) firstMatchIndex = ti;
      lastMatchIndex = ti;
      qi++;
    }
  }
  if (qi < q.length) return 0; // not all characters found in order

  const span = lastMatchIndex - firstMatchIndex + 1;
  const compactness = q.length / span; // closer to 1 = tighter match
  return Math.round(10 + compactness * 30); // 10–40 range
}

function scoreTool(query: string, tool: SearchableTool): number {
  const nameScore = scoreField(query, tool.name) * 1.0;
  const tagScore = Math.max(0, ...tool.tags.map((tag) => scoreField(query, tag))) * 0.6;
  const descScore = scoreField(query, tool.shortDescription) * 0.3;
  const categoryScore = scoreField(query, tool.categoryName) * 0.2;
  return Math.max(nameScore, tagScore, descScore, categoryScore);
}

export function searchTools(query: string, options: SearchOptions = {}): SearchResult[] {
  const { categorySlug, limit = 20 } = options;
  const index = getSearchIndex();
  const trimmed = query.trim();

  const pool = categorySlug ? index.filter((t) => t.categorySlug === categorySlug) : index;

  if (!trimmed) {
    // Browse mode: no query, optionally scoped to a category.
    return pool.slice(0, limit).map((tool) => ({ tool, score: 0 }));
  }

  const results: SearchResult[] = [];
  for (const tool of pool) {
    const score = scoreTool(trimmed, tool);
    if (score > 0) results.push({ tool, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function getTotalIndexedToolCount(): number {
  return getSearchIndex().length;
}
