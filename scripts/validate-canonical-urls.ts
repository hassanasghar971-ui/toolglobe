/**
 * Run via: npm run validate:seo
 *
 * Validates:
 * 1. Every tool and category canonical URL is well-formed and absolute.
 * 2. No duplicate canonical URLs exist across the entire sitemap.
 * 3. All Phase 7 legal/static page canonicals are present in the
 *    sitemap (prevents the 404-on-crawl risk flagged when legal pages
 *    were deliberately excluded from the sitemap prior to Phase 7).
 * 4. Sitemap priorities are within the valid [0, 1] range.
 *
 * Exits with code 1 on any error so this can gate CI/CD builds.
 */

import {
  getAllSitemapUrls,
  STATIC_LEGAL_SLUGS,
} from "@/lib/seo/sitemap-data";
import { getAllTools, getAllCategorySlugs } from "@/lib/tool-registry";
import {
  buildCanonicalUrl,
  buildStaticPageCanonicalUrl,
} from "@/lib/seo/canonical";
import { SITE_URL } from "@/lib/constants/site";

interface ValidationIssue {
  severity: "error" | "warning";
  message: string;
}

const issues: ValidationIssue[] = [];

function recordIssue(
  condition: boolean,
  message: string,
  severity: "error" | "warning" = "error"
): void {
  if (!condition) {
    issues.push({ severity, message });
  }
}

function validateUrlFormat(url: string, context: string): void {
  recordIssue(
    url.startsWith(SITE_URL),
    `${context}: URL does not start with SITE_URL (${SITE_URL}): ${url}`
  );
  recordIssue(
    !url.includes("undefined") && !url.includes("null"),
    `${context}: URL contains an unresolved value: ${url}`
  );
  recordIssue(
    url === SITE_URL || !url.endsWith("/"),
    `${context}: URL has an unexpected trailing slash: ${url}`
  );
  recordIssue(
    !/\s/.test(url),
    `${context}: URL contains whitespace: ${url}`
  );
}

function validateNoDuplicateUrls(urls: string[]): void {
  const seen = new Set<string>();
  for (const url of urls) {
    recordIssue(!seen.has(url), `Duplicate canonical URL detected: ${url}`);
    seen.add(url);
  }
}

function validateToolCanonicals(): void {
  const tools = getAllTools();
  recordIssue(tools.length > 0, "Tool registry returned zero tools.");

  for (const tool of tools) {
    const url = buildCanonicalUrl(tool.category, tool.slug);
    validateUrlFormat(url, `Tool "${tool.category}/${tool.slug}"`);
  }
}

function validateCategoryCanonicals(): void {
  const categorySlugs = getAllCategorySlugs();
  recordIssue(
    categorySlugs.length > 0,
    "Category registry returned zero categories."
  );

  for (const slug of categorySlugs) {
    const url = buildStaticPageCanonicalUrl(["tools", slug]);
    validateUrlFormat(url, `Category "${slug}"`);
  }
}

function validateLegalPageCanonicals(): void {
  const sitemapUrls = new Set(getAllSitemapUrls().map((entry) => entry.url));

  for (const slug of STATIC_LEGAL_SLUGS) {
    const url = buildStaticPageCanonicalUrl([slug]);
    validateUrlFormat(url, `Legal page "/${slug}"`);
    recordIssue(
      sitemapUrls.has(url),
      `Legal page canonical missing from sitemap (would 404 on crawl): ${url}`
    );
  }
}

function validateSitemapIntegrity(): void {
  const allEntries = getAllSitemapUrls();

  recordIssue(allEntries.length > 0, "Sitemap contains zero URL entries.");
  validateNoDuplicateUrls(allEntries.map((entry) => entry.url));

  for (const entry of allEntries) {
    recordIssue(
      entry.priority >= 0 && entry.priority <= 1,
      `Invalid sitemap priority (${entry.priority}) for URL: ${entry.url}`
    );
    recordIssue(
      !Number.isNaN(Date.parse(entry.lastModified)),
      `Invalid lastModified date for URL: ${entry.url}`
    );
  }
}

function run(): void {
  console.log("🔍 Validating canonical URLs and sitemap integrity...\n");

  validateToolCanonicals();
  validateCategoryCanonicals();
  validateLegalPageCanonicals();
  validateSitemapIntegrity();

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  if (warnings.length > 0) {
    console.warn(`⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.warn(`   - ${w.message}`));
    console.warn("");
  }

  if (errors.length > 0) {
    console.error(`❌ ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`   - ${e.message}`));
    process.exit(1);
  }

  console.log(
    `✅ All canonical URLs valid. ${getAllSitemapUrls().length} total sitemap entries checked.`
  );
  process.exit(0);
}

run();
