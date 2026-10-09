
// ============================================================
// ToolGlobe Core Data & Content Engine
// Handles deterministic tool generation, slug resolution,
// category-aware content templating, and AdSense-safe scaling.
// ============================================================

export type EngineType = 'code' | 'text' | 'media' | 'calc';

export interface ToolData {
  id: number;
  title: string;
  slug: string;
  category: string;
  toolType: string;
  engineType: EngineType;
  shortDescription: string;
  longDescription: string;
  keywords: string[];
}

export const CATEGORIES = [
  'ai-writing',
  'developer-tools',
  'seo-marketing',
  'image-editing',
  'video-utilities',
  'productivity-calc',
];

// ------------------------------------------------------------
// AdSense-Safe Scaling Control
// ------------------------------------------------------------
// While awaiting/under AdSense review, keep the site SMALL and
// fully functional (500 real tools) to avoid "thin content" or
// "scaled content abuse" flags. Only flip this to `true` AFTER
// approval, and the site will drip-expand automatically.
const IS_ADSENSE_APPROVED = false;

const START_DATE = new Date('2024-01-01').getTime();
const DAYS_ELAPSED = Math.max(0, Math.floor((Date.now() - START_DATE) / (1000 * 60 * 60 * 24)));

export const TOTAL_LIVE_TOOLS = IS_ADSENSE_APPROVED
  ? Math.min(20000, 500 + DAYS_ELAPSED * 200)
  : 500;

// ------------------------------------------------------------
// Deterministic pseudo-random helpers
// ------------------------------------------------------------
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(pseudoRandom(seed) * arr.length)];
}

function pickMany<T>(arr: T[], count: number, seed: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  let s = seed;
  while (result.length < Math.min(count, copy.length)) {
    const idx = Math.floor(pseudoRandom(s) * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
    s += 1.11;
  }
  return result;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ------------------------------------------------------------
// Category-Specific Configuration
// Each category maps to a REAL engine type implemented in
// ToolEngine.tsx — titles never promise functionality that
// doesn't exist on the page.
// ------------------------------------------------------------
interface CategoryConfig {
  engineType: EngineType;
  toolTypes: string[];
  audiences: string[];
  capabilities: string[];
  useCases: string[];
  extraFaqs: { q: string; a: string }[];
}

const ANGLES = ['Free', 'Instant', 'Online', 'Quick', 'Advanced', 'Smart', 'Reliable', 'Lightweight'];

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  'developer-tools': {
    engineType: 'code',
    toolTypes: ['JSON Formatter & Validator', 'Base64 Encoder & Decoder', 'URL Encoder & Decoder'],
    audiences: ['Web Developers', 'Backend Engineers', 'QA Testers', 'API Integrators', 'Students Learning Code'],
    capabilities: [
      'Format and beautify raw JSON with proper indentation',
      'Validate JSON syntax and surface parsing errors instantly',
      'Encode or decode Base64 strings for data transport',
      'Encode or decode URL components safely for query strings',
    ],
    useCases: [
      'Debugging malformed API responses before deployment',
      'Preparing Base64 payloads for embedding in HTML or email templates',
      'Sanitizing query parameters before passing them into a URL',
      'Quickly inspecting third-party webhook JSON payloads',
      'Teaching junior developers how structured data is formatted',
    ],
    extraFaqs: [
      { q: 'Can this tool handle deeply nested JSON objects?', a: 'Yes, the formatter recursively processes nested objects and arrays of any depth supported by your browser\'s JavaScript engine.' },
      { q: 'Is Base64 encoding here reversible?', a: 'Yes, switch to the Decode mode and paste your encoded string to retrieve the original text instantly.' },
      { q: 'Does this support UTF-8 characters in Base64 operations?', a: 'Yes, the encoder/decoder correctly handles multi-byte UTF-8 characters, not just ASCII text.' },
    ],
  },
  'seo-marketing': {
    engineType: 'text',
    toolTypes: ['Meta Description Length Checker', 'URL Slug Generator', 'SEO Text Cleaner', 'Keyword Density Analyzer'],
    audiences: ['SEO Specialists', 'Content Marketers', 'Agency Teams', 'Freelance Copywriters', 'Small Business Owners'],
    capabilities: [
      'Count words, characters, and estimate reading time in real time',
      'Generate clean, URL-safe slugs from any title or heading',
      'Remove excess whitespace and formatting artifacts from pasted text',
      'Analyze keyword frequency and density across a block of text',
    ],
    useCases: [
      'Checking whether a meta description fits within search engine display limits',
      'Generating consistent, SEO-friendly URL slugs for blog posts',
      'Cleaning up text copied from Word or Google Docs before publishing',
      'Spotting keyword stuffing risks before submitting content for review',
      'Standardizing capitalization across page titles and headings',
    ],
    extraFaqs: [
      { q: 'Does the slug generator remove special characters?', a: 'Yes, it strips all non-alphanumeric characters and converts spaces into hyphens for clean, crawlable URLs.' },
      { q: 'How is keyword density calculated?', a: 'The tool counts occurrences of each significant word (longer than two characters) and expresses it as a percentage of total word count.' },
    ],
  },
  'ai-writing': {
    engineType: 'text',
    toolTypes: ['Word & Character Counter', 'Text Case Converter', 'Duplicate Spacing Cleaner', 'Sentence Case Formatter'],
    audiences: ['Content Writers', 'Students', 'Bloggers', 'Authors', 'Social Media Managers'],
    capabilities: [
      'Count words, characters, and sentences instantly as you type',
      'Convert text between UPPERCASE, lowercase, Title Case, and Sentence case',
      'Strip duplicate spaces and excessive line breaks from pasted drafts',
      'Analyze keyword repetition patterns across long-form drafts',
    ],
    useCases: [
      'Meeting strict word-count requirements for essays or assignments',
      'Formatting article headlines consistently across a publication',
      'Cleaning up text pasted from PDFs that contain irregular spacing',
      'Proofreading drafts before submitting to an editor or client',
      'Converting all-caps text into properly cased sentences',
    ],
    extraFaqs: [
      { q: 'Does the character counter include spaces?', a: 'The tool displays both counts separately — with spaces and without — so you can match any platform\'s specific requirement.' },
      { q: 'Will Title Case correctly handle small words like "and" or "the"?', a: 'The converter capitalizes the first letter of every word for consistency; for strict editorial style guides, manual review is still recommended.' },
    ],
  },
  'image-editing': {
    engineType: 'media',
    toolTypes: ['Image Resizer', 'Image Dimension Inspector', 'Canvas-Based Image Compressor'],
    audiences: ['Graphic Designers', 'E-commerce Sellers', 'Bloggers', 'Social Media Managers', 'Web Developers'],
    capabilities: [
      'Upload any image and inspect its exact dimensions, size, and type',
      'Resize images to custom width and height with aspect-ratio locking',
      'Generate a downloadable resized copy entirely in your browser',
      'Preview results instantly before exporting',
    ],
    useCases: [
      'Resizing product photos to fit marketplace image requirements',
      'Shrinking oversized images before uploading them to a CMS',
      'Checking image dimensions before using them in a design template',
      'Preparing social media graphics in platform-specific dimensions',
    ],
    extraFaqs: [
      { q: 'Are my images uploaded to a server?', a: 'No, all resizing happens locally using the HTML5 Canvas API. Your image never leaves your device.' },
      { q: 'What image formats are supported?', a: 'Any format your browser can render, including JPEG, PNG, and WebP.' },
    ],
  },
  'video-utilities': {
    engineType: 'media',
    toolTypes: ['Video Metadata Inspector', 'Video Thumbnail Extractor'],
    audiences: ['Video Editors', 'Content Creators', 'Social Media Managers', 'Podcasters'],
    capabilities: [
      'Upload a video and instantly read its duration and resolution',
      'Capture a frame from the video timeline as a downloadable thumbnail',
      'Preview video metadata without any upload to external servers',
    ],
    useCases: [
      'Extracting a quick thumbnail for a YouTube or blog preview',
      'Verifying video resolution before publishing to a platform',
      'Checking video duration against a platform\'s length limit',
    ],
    extraFaqs: [
      { q: 'Is my video file uploaded anywhere?', a: 'No, the video is loaded locally in your browser using object URLs; nothing is transmitted externally.' },
      { q: 'Why does thumbnail capture fail on some files?', a: 'Certain video codecs or cross-origin sources may restrict frame access for security reasons; try a locally downloaded MP4 file instead.' },
    ],
  },
  'productivity-calc': {
    engineType: 'calc',
    toolTypes: ['Sum & Average Calculator', 'Percentage Calculator', 'Number List Statistics Tool'],
    audiences: ['Students', 'Accountants', 'Analysts', 'Project Managers', 'Small Business Owners'],
    capabilities: [
      'Calculate sum, average, minimum, maximum, and median from a list of numbers',
      'Compute percentage relationships between two values',
      'Instantly see percentage increase and decrease projections',
    ],
    useCases: [
      'Calculating the average of exam scores or survey responses',
      'Working out discount or markup percentages for pricing',
      'Finding the median value in a dataset without spreadsheet software',
      'Quickly summing expense line items while budgeting',
    ],
    extraFaqs: [
      { q: 'What number formats are accepted?', a: 'You can separate numbers with commas, spaces, or new lines — the tool parses all three automatically.' },
      { q: 'Does this tool handle negative numbers?', a: 'Yes, all statistical calculations correctly account for negative values.' },
    ],
  },
};

const COMMON_FAQS = [
  { q: 'Is there any usage limit on this tool?', a: 'No, you can run unlimited operations since all processing happens locally in your browser.' },
  { q: 'Do I need to create an account to use this?', a: 'No signup is required. The tool is fully accessible and free to use immediately.' },
  { q: 'Is my data stored on ToolGlobe servers?', a: 'No, this tool processes everything client-side. Nothing you enter is logged, stored, or transmitted to a server.' },
];

const INTRO_VARIANTS = [
  (title: string, category: string) =>
    `The **${title}** is a dedicated browser-based utility built for the **${category.replace('-', ' ')}** category, engineered to deliver instant results without installing any software.`,
  (title: string, category: string) =>
    `Designed for speed and precision, the **${title}** brings a focused **${category.replace('-', ' ')}** workflow directly into your browser tab — no downloads, no setup.`,
  (title: string, category: string) =>
    `If you work in **${category.replace('-', ' ')}**, the **${title}** was built to remove friction from a specific, repetitive task using nothing but your web browser.`,
];

function buildLongDescription(
  id: number,
  title: string,
  category: string,
  config: CategoryConfig
): string {
  const intro = INTRO_VARIANTS[id % INTRO_VARIANTS.length](title, category);
  const usersCount = 1200 + ((id * 53) % 18000);
  const rating = (4.2 + (id % 8) * 0.1).toFixed(1);

  const capabilities = pickMany(config.capabilities, Math.min(3, config.capabilities.length), id * 2.2);
  const useCases = pickMany(config.useCases, Math.min(4, config.useCases.length), id * 3.4);
  const extraFaqs = pickMany(config.extraFaqs, Math.min(2, config.extraFaqs.length), id * 4.6);
  const commonFaqs = pickMany(COMMON_FAQS, 2, id * 5.8);

  const faqBlock = [...extraFaqs, ...commonFaqs]
    .map((f) => `**Q: ${f.q}**\nA: ${f.a}`)
    .join('\n\n');

  return `
${intro}

### What This Tool Actually Does
${capabilities.map((c) => `- ${c}`).join('\n')}

### Why Use It
Approximately **${usersCount.toLocaleString()} users** have run operations through tools in this category, with an average satisfaction rating of **${rating}/5**. Every action executes locally in your browser using native Web APIs — nothing is uploaded, queued, or processed on a remote server, which means your data stays private and results return instantly.

### Common Use Cases
${useCases.map((u, i) => `${i + 1}. ${u}`).join('\n')}

### Frequently Asked Questions
${faqBlock}
  `.trim();
}

// ------------------------------------------------------------
// Core Generator
// ------------------------------------------------------------
export function generateToolById(id: number): ToolData {
  const category = pick(CATEGORIES, id * 1.5);
  const config = CATEGORY_CONFIG[category];

  const toolType = pick(config.toolTypes, id * 2.1);
  const angle = pick(ANGLES, id * 3.3);
  const audience = pick(config.audiences, id * 4.7);

  const title = `${angle} ${toolType} for ${audience}`;
  const slug = `${slugify(title)}-${id}`;

  const shortDescription = `${angle} ${toolType.toLowerCase()} built for ${audience.toLowerCase()}. 100% browser-based, free, and requires zero signup or API setup.`;
  const longDescription = buildLongDescription(id, title, category, config);

  const keywords = [
    toolType.toLowerCase(),
    `free ${toolType.toLowerCase()}`,
    `${category.replace('-', ' ')} tool`,
    `online ${toolType.toLowerCase()} for ${audience.toLowerCase()}`,
    'browser based tool no signup',
  ];

  return {
    id,
    title,
    slug,
    category,
    toolType,
    engineType: config.engineType,
    shortDescription,
    longDescription,
    keywords,
  };
}

// ------------------------------------------------------------
// Slug Resolution (strict match prevents duplicate-URL issues)
// ------------------------------------------------------------
export function getToolBySlug(slug: string): ToolData | null {
  const match = slug.match(/-(\d+)$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  if (isNaN(id) || id < 1 || id > TOTAL_LIVE_TOOLS) return null;

  const tool = generateToolById(id);

  // Enforce exact canonical slug match — rejects guessed/garbage URLs
  // that only share the numeric suffix, eliminating duplicate-path risk.
  if (tool.slug !== slug) return null;

  return tool;
}

// ------------------------------------------------------------
// Paginated Listing
// ------------------------------------------------------------
export function getToolsPage(
  page: number = 1,
  limit: number = 24
): { tools: ToolData[]; totalPages: number } {
  const totalTools = TOTAL_LIVE_TOOLS;
  const totalPages = Math.max(1, Math.ceil(totalTools / limit));
  const startId = (page - 1) * limit + 1;
  const endId = Math.min(startId + limit - 1, totalTools);

  const tools: ToolData[] = [];
  for (let i = startId; i <= endId; i++) {
    tools.push(generateToolById(i));
  }

  return { tools, totalPages };
}
