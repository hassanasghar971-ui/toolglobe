export interface ToolProfile {
  id: number;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  longDescription: string;
  category: string;
  pricing: string;
  rating: number;
  reviewsCount: number;
  externalUrl: string;
  longKeywords: string[];
  features: string[];
  useCases: string[];
  faqs: { question: string; answer: string }[];
}

const CATEGORIES = [
  'Writing & Content', 'Code & Developer', 'Image & Vision', 
  'Audio & Speech', 'Video & Motion', 'Business & SEO', 
  'Productivity', 'Data & Analytics'
];

const VERBS = ['Automate', 'Generate', 'Optimize', 'Enhance', 'Transform', 'Accelerate'];
const NICHES = ['Workflows', 'SEO Strategies', 'Source Code', 'Marketing Copies', 'Data Schemas'];

const LAUNCH_DATE = new Date('2026-10-01').getTime();
const CURRENT_DATE = new Date().getTime();
const daysPassed = Math.max(1, Math.floor((CURRENT_DATE - LAUNCH_DATE) / (1000 * 60 * 60 * 24)));

export const TOTAL_LIVE_TOOLS = Math.min(20000, daysPassed * 500);

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getToolBySlug(slug: string): ToolProfile | null {
  const match = slug.match(/^ai-(.+)-(\d+)$/);
  let id = 1;
  if (match) {
    id = parseInt(match[2], 10);
  } else {
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    id = (hash % 20000) + 1;
  }
  if (isNaN(id) || id < 1 || id > 20000) return null;
  return generateToolById(id, slug);
}

export function generateToolById(id: number, customSlug?: string): ToolProfile {
  const r1 = pseudoRandom(id);
  const r2 = pseudoRandom(id * 2);
  const r3 = pseudoRandom(id * 3);

  const category = CATEGORIES[Math.floor(r1 * CATEGORIES.length)];
  const verb = VERBS[Math.floor(r2 * VERBS.length)];
  const niche = NICHES[Math.floor(r3 * NICHES.length)];

  const slug = customSlug || `ai-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`;
  const title = `Free AI ${verb} ${niche} Tool #${id}`;
  const rating = parseFloat((4.3 + r1 * 0.65).toFixed(1));
  const reviewsCount = Math.floor(150 + r2 * 750);

  const metaTitle = `${title} - Free Online AI Utility`;
  const metaDescription = `Use ToolGlobe's free online ${title.toLowerCase()} to ${verb.toLowerCase()} your ${niche.toLowerCase()} without API keys or registrations. High speed, client-side, 100% private.`;

  const longKeywords = [
    `free online ${title.toLowerCase()}`,
    `best ai ${niche.toLowerCase()} engine 2026`,
    `no api key ${verb.toLowerCase()} utility`,
    `client side ${category.toLowerCase()} tool`
  ];

  const longDescription = `Welcome to the official client-side interface for **${title}** hosted on the ToolGlobe directory. In an ecosystem where speed, confidentiality, and reliability are paramount, this utility delivers high-throughput algorithm performance directly within your client browser environment.

### Technical Performance Parameters
1. **Local Context Execution:** Data processing takes place purely in browser memory storage, mitigating third-party transmission risks.
2. **Zero API/Token Dependencies:** Fully operational without registration tokens, paywalls, or subscription models.
3. **Responsive Interface:** Designed to dynamically adapt across desktop monitors, tablet viewports, and mobile displays with zero Cumulative Layout Shift (CLS).

### Operational Workflow:
- **Step 1:** Enter your target dataset or parameters into the execution workspace provided above.
- **Step 2:** Trigger local execution using the action button.
- **Step 3:** Copy or export processed outputs using integrated 1-click clipboard utilities.

For questions or developer API partnerships, contact Hassan Asghar at hassanasghar7868686@gmail.com.`;

  return {
    id,
    slug,
    title,
    metaTitle,
    metaDescription,
    longDescription,
    category,
    pricing: '100% Free',
    rating,
    reviewsCount,
    externalUrl: `https://toolglobe.vercel.app/tools/${slug}`,
    longKeywords,
    features: [
      'Pure client-side execution with sub-millisecond execution',
      'No data collection or logging to remote servers',
      'Instant clipboard copy and asset export',
      'Zero API key configuration required'
    ],
    useCases: [
      `Automating daily ${niche.toLowerCase()} tasks for workflow efficiency`,
      'Rapid prototype formatting and content polishing',
      'Secure offline-capable web application tasks'
    ],
    faqs: [
      {
        question: `Is ${title} completely free?`,
        answer: 'Yes, 100% free with no monthly subscription or hidden fees.'
      },
      {
        question: 'Is my data transmitted to external servers?',
        answer: 'No. All operations run locally within your browser context.'
      }
    ]
  };
}

export function getToolsPage(page: number = 1, pageSize: number = 24) {
  const totalTools = TOTAL_LIVE_TOOLS;
  const totalPages = Math.ceil(totalTools / pageSize);
  const startId = (page - 1) * pageSize + 1;
  const endId = Math.min(startId + pageSize - 1, totalTools);

  const tools: ToolProfile[] = [];
  for (let id = startId; id <= endId; id++) {
    tools.push(generateToolById(id));
  }

  return { tools, totalTools, totalPages, currentPage: page };
}
