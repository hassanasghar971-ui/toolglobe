import {
  getAllTools,
  getAllCategories,
} from "@/lib/tool-registry";
import {
  buildCanonicalUrl,
  buildStaticPageCanonicalUrl,
} from "@/lib/seo/canonical";
import {
  getAllSitemapUrls,
  getSitemapChunkCount,
  getSitemapChunk,
  SITEMAP_CHUNK_SIZE,
} from "@/lib/seo/sitemap-data";

const errors: string[] = [];

const sitemapEntries = getAllSitemapUrls();
const sitemapUrls = sitemapEntries.map((e) => e.url);
const sitemapUrlSet = new Set(sitemapUrls);

/* 1. No duplicate URLs anywhere in the aggregated sitemap data. */
if (sitemapUrlSet.size !== sitemapUrls.length) {
  errors.push("Duplicate URL detected across aggregated sitemap entries.");
}

/* 2. Every tool's canonical URL must be absolute and present in the sitemap. */
for (const tool of getAllTools()) {
  const canonical = buildCanonicalUrl(tool.category, tool.slug);

  if (!canonical.startsWith("https://")) {
    errors.push(
      `Non-absolute canonical URL for tool "${tool.slug}": ${canonical}`
    );
  }
  if (!sitemapUrlSet.has(canonical)) {
    errors.push(
      `Tool "${tool.slug}" canonical URL is missing from the sitemap: ${canonical}`
    );
  }
}

/* 3. Every category's canonical URL must be present in the sitemap. */
for (const category of getAllCategories()) {
  const canonical = buildStaticPageCanonicalUrl(["tools", category.slug]);
  if (!sitemapUrlSet.has(canonical)) {
    errors.push(
      `Category "${category.slug}" canonical URL is missing from the sitemap: ${canonical}`
    );
  }
}

/* 4. Chunk integrity: every URL must appear in EXACTLY one chunk — never
      zero (missing from crawl) and never duplicated across chunks. */
const chunkCount = getSitemapChunkCount();
const occurrenceCount = new Map<string, number>();

for (let id = 0; id < chunkCount; id++) {
  for (const entry of getSitemapChunk(id)) {
    occurrenceCount.set(entry.url, (occurrenceCount.get(entry.url) ?? 0) + 1);
  }
}

for (const url of sitemapUrls) {
  const count = occurrenceCount.get(url) ?? 0;
  if (count !== 1) {
    errors.push(
      `URL "${url}" appears in ${count} sitemap chunk(s) (expected exactly 1).`
    );
  }
}

/* 5. Hard spec limit: no chunk may exceed 5,000 URLs. */
for (let id = 0; id < chunkCount; id++) {
  const size = getSitemapChunk(id).length;
  if (size > SITEMAP_CHUNK_SIZE) {
    errors.push(
      `Sitemap chunk ${id} contains ${size} URLs, exceeding the ${SITEMAP_CHUNK_SIZE}-URL limit.`
    );
  }
}

if (errors.length > 0) {
  console.error("❌ Canonical/Sitemap QA failed:\n");
  errors.forEach((e) => console.error(` - ${e}`));
  process.exit(1);
}

console.log(
  `✅ Canonical/Sitemap QA passed — ${sitemapUrls.length} URLs across ${chunkCount} chunk(s), max chunk size ${SITEMAP_CHUNK_SIZE}.`
);
process.exit(0);
