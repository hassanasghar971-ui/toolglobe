// ============================================================
// TOOLGLOBE — 20,000 MICRO-TOOLS MASTER REGISTRY
// Organized into 40 categories × 500 tools each
// ============================================================

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  inputLabel: string;
  inputPlaceholder: string;
  inputType: "text" | "textarea" | "number" | "select" | "dual";
  outputType: "text" | "list" | "table" | "code" | "number" | "color";
  selectOptions?: string[];
  dualLabels?: [string, string];
}

export interface CategoryMeta {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// ─── 40 CATEGORIES ─────────────────────────────────────────
export const CATEGORIES: CategoryMeta[] = [
  { slug: "text-tools", name: "Text Tools", icon: "📝", description: "Advanced text manipulation, formatting and analysis utilities", color: "from-blue-500 to-indigo-600" },
  { slug: "seo-tools", name: "SEO Tools", icon: "🔍", description: "Search engine optimization and keyword research tools", color: "from-green-500 to-emerald-600" },
  { slug: "math-tools", name: "Math & Calculator Tools", icon: "🔢", description: "Mathematical computations, converters and calculators", color: "from-purple-500 to-violet-600" },
  { slug: "color-tools", name: "Color Tools", icon: "🎨", description: "Color conversion, palette generation and design utilities", color: "from-pink-500 to-rose-600" },
  { slug: "developer-tools", name: "Developer Tools", icon: "💻", description: "Coding utilities, formatters, and developer helpers", color: "from-slate-500 to-gray-700" },
  { slug: "unit-converter", name: "Unit Converter", icon: "⚖️", description: "Convert between any units of measurement instantly", color: "from-orange-500 to-amber-600" },
  { slug: "image-tools", name: "Image Tools", icon: "🖼️", description: "Image processing, metadata and color extraction tools", color: "from-teal-500 to-cyan-600" },
  { slug: "time-date-tools", name: "Time & Date Tools", icon: "⏰", description: "Date calculators, timezone converters and time utilities", color: "from-yellow-500 to-orange-500" },
  { slug: "password-tools", name: "Password & Security Tools", icon: "🔐", description: "Password generators, strength checkers and security auditors", color: "from-red-500 to-rose-600" },
  { slug: "encoding-tools", name: "Encoding & Decoding Tools", icon: "🔄", description: "Base64, URL, HTML and cipher encoding/decoding utilities", color: "from-indigo-500 to-blue-600" },
  { slug: "random-generators", name: "Random Generators", icon: "🎲", description: "Random data, name, UUID and number generators", color: "from-fuchsia-500 to-purple-600" },
  { slug: "finance-tools", name: "Finance & Money Tools", icon: "💰", description: "Financial calculators, interest rates and budget planners", color: "from-green-600 to-teal-600" },
  { slug: "health-tools", name: "Health & Fitness Tools", icon: "🏋️", description: "BMI, calorie, nutrition and wellness calculators", color: "from-lime-500 to-green-600" },
  { slug: "writing-tools", name: "Writing & Grammar Tools", icon: "✍️", description: "Grammar checks, readability scores and writing enhancers", color: "from-violet-500 to-purple-600" },
  { slug: "social-media-tools", name: "Social Media Tools", icon: "📱", description: "Hashtag generators, bio optimizers and engagement calculators", color: "from-sky-500 to-blue-600" },
  { slug: "binary-tools", name: "Binary & Number System Tools", icon: "01", description: "Binary, hex, octal and number base conversion tools", color: "from-gray-600 to-slate-700" },
  { slug: "string-tools", name: "String & Pattern Tools", icon: "🔤", description: "String operations, regex testers and pattern generators", color: "from-cyan-500 to-teal-600" },
  { slug: "json-tools", name: "JSON & Data Tools", icon: "{ }", description: "JSON formatters, validators, converters and data tools", color: "from-amber-500 to-yellow-600" },
  { slug: "css-tools", name: "CSS & Design Tools", icon: "🎭", description: "CSS generators, gradient builders and design helpers", color: "from-pink-600 to-purple-600" },
  { slug: "network-tools", name: "Network & IP Tools", icon: "🌐", description: "IP lookup, subnet calculators and network utilities", color: "from-blue-600 to-cyan-600" },
  { slug: "crypto-tools", name: "Crypto & Hash Tools", icon: "🔑", description: "Hashing algorithms, cryptographic tools and checksum utilities", color: "from-yellow-600 to-orange-600" },
  { slug: "html-tools", name: "HTML & Web Tools", icon: "🌍", description: "HTML encoders, tag strippers and web utilities", color: "from-orange-600 to-red-500" },
  { slug: "scientific-tools", name: "Scientific Calculator Tools", icon: "🔬", description: "Advanced scientific calculations and formula solvers", color: "from-teal-600 to-green-600" },
  { slug: "statistics-tools", name: "Statistics & Probability Tools", icon: "📊", description: "Statistical analysis, probability calculators and data tools", color: "from-indigo-600 to-violet-600" },
  { slug: "geometry-tools", name: "Geometry & Shape Tools", icon: "📐", description: "Area, perimeter, volume and geometric shape calculators", color: "from-rose-600 to-pink-600" },
  { slug: "chemistry-tools", name: "Chemistry Tools", icon: "⚗️", description: "Molecular weight, element lookup and chemistry calculators", color: "from-emerald-600 to-teal-600" },
  { slug: "physics-tools", name: "Physics Tools", icon: "⚡", description: "Physics formulas, force, energy and motion calculators", color: "from-blue-700 to-indigo-700" },
  { slug: "astronomy-tools", name: "Astronomy Tools", icon: "🌟", description: "Star charts, planet distance and astronomical calculators", color: "from-slate-700 to-gray-900" },
  { slug: "language-tools", name: "Language & Translation Tools", icon: "🌏", description: "Language detection, transliteration and linguistics tools", color: "from-amber-600 to-yellow-500" },
  { slug: "business-tools", name: "Business & Productivity Tools", icon: "📋", description: "Invoice calculators, ROI analyzers and business metric tools", color: "from-blue-800 to-indigo-800" },
  { slug: "music-tools", name: "Music & Audio Tools", icon: "🎵", description: "BPM calculators, note converters and audio utilities", color: "from-purple-700 to-fuchsia-600" },
  { slug: "cooking-tools", name: "Cooking & Recipe Tools", icon: "🍳", description: "Recipe scalers, unit converters and nutrition calculators", color: "from-orange-700 to-red-600" },
  { slug: "travel-tools", name: "Travel & Geography Tools", icon: "✈️", description: "Distance calculators, timezone and travel planning tools", color: "from-sky-600 to-blue-700" },
  { slug: "education-tools", name: "Education & Study Tools", icon: "📚", description: "GPA calculators, grade converters and study helpers", color: "from-green-700 to-emerald-700" },
  { slug: "sport-tools", name: "Sports & Fitness Tools", icon: "🏅", description: "Pace calculators, race predictors and athlete performance tools", color: "from-red-600 to-orange-600" },
  { slug: "fun-tools", name: "Fun & Entertainment Tools", icon: "🎉", description: "Fun generators, quizzes and entertainment utilities", color: "from-fuchsia-600 to-pink-600" },
  { slug: "pdf-tools", name: "PDF & Document Tools", icon: "📄", description: "PDF metadata, word count and document processing tools", color: "from-red-700 to-rose-700" },
  { slug: "email-tools", name: "Email & Communication Tools", icon: "📧", description: "Email formatters, subject generators and communication helpers", color: "from-blue-500 to-sky-600" },
  { slug: "ai-tools", name: "AI & Automation Tools", icon: "🤖", description: "AI prompt builders, automation helpers and smart generators", color: "from-violet-600 to-purple-700" },
  { slug: "misc-tools", name: "Miscellaneous Tools", icon: "🛠️", description: "Utility tools that don't fit anywhere else but are super useful", color: "from-gray-500 to-slate-600" },
];

// ─── TOOL DEFINITION FACTORY ────────────────────────────────
function tool(
  slug: string,
  name: string,
  description: string,
  category: string,
  keywords: string[],
  inputLabel: string,
  inputPlaceholder: string,
  inputType: ToolMeta["inputType"] = "textarea",
  outputType: ToolMeta["outputType"] = "text",
  extra?: Partial<ToolMeta>
): ToolMeta {
  return { slug, name, description, category, keywords, inputLabel, inputPlaceholder, inputType, outputType, ...extra };
}

// ─── TEXT TOOLS (50 representative + engine generates rest) ─
const TEXT_TOOLS: ToolMeta[] = [
  tool("word-counter", "Word Counter", "Count words, characters, sentences and paragraphs in any text", "text-tools", ["word count tool online free", "character counter", "count words in text"], "Enter Your Text", "Paste or type your text here to count words, characters, sentences...", "textarea", "table"),
  tool("character-counter", "Character Counter", "Count characters with and without spaces in any text", "text-tools", ["character counter online", "count characters text", "letter counter tool"], "Enter Your Text", "Type or paste text to count characters instantly...", "textarea", "table"),
  tool("text-reverser", "Text Reverser", "Reverse any text string instantly online", "text-tools", ["reverse text online free", "flip text backwards", "mirror text generator"], "Enter Text to Reverse", "Type text here and it will be reversed instantly...", "textarea", "text"),
  tool("uppercase-converter", "Uppercase Converter", "Convert any text to UPPERCASE letters online", "text-tools", ["convert text to uppercase online", "caps lock converter", "make text all caps"], "Enter Text to Convert", "Enter your text and convert it to uppercase...", "textarea", "text"),
  tool("lowercase-converter", "Lowercase Converter", "Convert any text to lowercase letters instantly", "text-tools", ["convert text to lowercase online", "lowercase text converter", "make text small caps"], "Enter Text to Convert", "Enter your text and convert it to lowercase...", "textarea", "text"),
  tool("title-case-converter", "Title Case Converter", "Convert text to Title Case for headlines and titles", "text-tools", ["title case converter online", "capitalize each word tool", "headline case converter"], "Enter Text", "Enter text to convert to Title Case...", "textarea", "text"),
  tool("sentence-case-converter", "Sentence Case Converter", "Fix capitalization to proper sentence case", "text-tools", ["sentence case converter online free", "fix capitalization tool", "proper case converter"], "Enter Text", "Enter text to convert to sentence case...", "textarea", "text"),
  tool("text-sorter", "Text Line Sorter", "Sort lines of text alphabetically, numerically or randomly", "text-tools", ["sort text lines online", "alphabetical sorter tool", "text sorting utility"], "Enter Lines to Sort", "Enter one item per line to sort them...", "textarea", "text"),
  tool("duplicate-line-remover", "Duplicate Line Remover", "Remove duplicate lines from any text instantly", "text-tools", ["remove duplicate lines online free", "deduplicate text tool", "unique lines filter"], "Enter Text with Duplicates", "Paste text with duplicate lines to remove them...", "textarea", "text"),
  tool("text-to-slug", "Text to Slug Converter", "Convert any text into a clean URL-friendly slug", "text-tools", ["text to slug converter online", "url slug generator", "seo friendly slug tool"], "Enter Text", "Enter title or text to convert to URL slug...", "textarea", "text"),
  tool("text-truncator", "Text Truncator", "Truncate text to a specific character or word limit", "text-tools", ["truncate text online tool", "shorten text to limit", "text cutter tool"], "Enter Text", "Paste text to truncate to desired length...", "textarea", "text"),
  tool("whitespace-remover", "Whitespace Remover", "Remove extra spaces, tabs and blank lines from text", "text-tools", ["remove extra spaces online", "whitespace cleaner tool", "trim text spaces free"], "Enter Text", "Paste text to remove all extra whitespace...", "textarea", "text"),
  tool("text-repeater", "Text Repeater", "Repeat any text a specified number of times", "text-tools", ["text repeater online free", "repeat string tool", "duplicate text generator"], "Enter Text to Repeat", "Enter text and number of repetitions...", "dual", "text", { dualLabels: ["Text to Repeat", "Number of Times"] }),
  tool("palindrome-checker", "Palindrome Checker", "Check if a word or phrase is a palindrome", "text-tools", ["palindrome checker online free", "is it a palindrome tool", "palindrome word detector"], "Enter Word or Phrase", "Enter a word or phrase to check if it is a palindrome...", "text", "text"),
  tool("anagram-checker", "Anagram Checker", "Check if two words are anagrams of each other", "text-tools", ["anagram checker online free", "anagram detector tool", "word anagram finder"], "Enter Two Words", "Enter first word, comma, second word to check anagram...", "text", "text"),
  tool("text-to-binary", "Text to Binary Converter", "Convert plain text to binary (0s and 1s) encoding", "text-tools", ["text to binary converter online", "convert text to binary code", "ascii to binary tool"], "Enter Text", "Type text to convert to binary...", "textarea", "text"),
  tool("binary-to-text", "Binary to Text Converter", "Decode binary code back to readable text", "text-tools", ["binary to text converter online", "decode binary code online free", "binary decoder tool"], "Enter Binary Code", "Enter binary (0s and 1s) to decode to text...", "textarea", "text"),
  tool("morse-code-encoder", "Morse Code Encoder", "Convert text to Morse code dots and dashes", "text-tools", ["text to morse code converter online", "morse code encoder tool", "encode morse code free"], "Enter Text", "Enter text to encode into Morse code...", "textarea", "text"),
  tool("morse-code-decoder", "Morse Code Decoder", "Decode Morse code back into readable text", "text-tools", ["morse code decoder online free", "decode morse code tool", "morse code to text converter"], "Enter Morse Code", "Enter Morse code (use . for dot, - for dash, space between letters)...", "textarea", "text"),
  tool("pig-latin-translator", "Pig Latin Translator", "Translate English text to Pig Latin instantly", "text-tools", ["pig latin translator online free", "pig latin converter tool", "english to pig latin"], "Enter English Text", "Enter English words to translate to Pig Latin...", "textarea", "text"),
  tool("lorem-ipsum-generator", "Lorem Ipsum Generator", "Generate placeholder Lorem Ipsum text for design mockups", "text-tools", ["lorem ipsum generator online free", "placeholder text generator", "dummy text generator tool"], "Number of Paragraphs", "Enter number of paragraphs (1-20)...", "number", "text"),
  tool("text-diff-checker", "Text Difference Checker", "Compare two texts and highlight the differences", "text-tools", ["text diff checker online free", "compare two texts tool", "find differences between texts"], "Enter First Text", "Compare two versions of text side by side...", "dual", "text", { dualLabels: ["Original Text", "Modified Text"] }),
  tool("vowel-counter", "Vowel Counter", "Count vowels and consonants in any text", "text-tools", ["vowel counter online free", "count vowels in text", "vowel consonant counter tool"], "Enter Text", "Enter text to count vowels and consonants...", "textarea", "table"),
  tool("text-formatter", "Text Formatter & Cleaner", "Clean and format messy text with one click", "text-tools", ["text formatter online free", "clean up text tool", "format text automatically"], "Enter Unformatted Text", "Paste messy text to clean and format it...", "textarea", "text"),
  tool("reading-time-estimator", "Reading Time Estimator", "Estimate how long it takes to read your text", "text-tools", ["reading time estimator online free", "calculate reading time tool", "article reading time calculator"], "Enter Your Text", "Paste your article or text to estimate reading time...", "textarea", "table"),
  tool("camel-case-converter", "Camel Case Converter", "Convert text to camelCase for variable naming", "text-tools", ["camel case converter online free", "text to camelCase tool", "variable name formatter"], "Enter Text", "Enter text to convert to camelCase...", "textarea", "text"),
  tool("snake-case-converter", "Snake Case Converter", "Convert text to snake_case for programming", "text-tools", ["snake case converter online free", "text to snake_case tool", "underscore case converter"], "Enter Text", "Enter text to convert to snake_case...", "textarea", "text"),
  tool("kebab-case-converter", "Kebab Case Converter", "Convert text to kebab-case for CSS and URLs", "text-tools", ["kebab case converter online free", "text to kebab-case tool", "hyphen case converter"], "Enter Text", "Enter text to convert to kebab-case...", "textarea", "text"),
  tool("text-encryptor", "Caesar Cipher Encryptor", "Encrypt text using the classic Caesar cipher method", "text-tools", ["caesar cipher encryptor online free", "rot13 text encoder", "simple text encryption tool"], "Enter Text", "Enter text to encrypt with Caesar cipher...", "textarea", "text"),
  tool("word-frequency-analyzer", "Word Frequency Analyzer", "Analyze how often each word appears in your text", "text-tools", ["word frequency analyzer online free", "word occurrence counter tool", "text word frequency chart"], "Enter Text", "Paste text to analyze word frequency...", "textarea", "table"),
];

// ─── SEO TOOLS ───────────────────────────────────────────────
const SEO_TOOLS: ToolMeta[] = [
  tool("meta-title-checker", "Meta Title Checker", "Check your page title length and SEO score", "seo-tools", ["meta title length checker online free", "seo title analyzer tool", "check meta title length"], "Enter Meta Title", "Enter your page title to check SEO compliance...", "text", "table"),
  tool("meta-description-checker", "Meta Description Checker", "Analyze meta description length and effectiveness", "seo-tools", ["meta description checker online free", "seo meta description analyzer", "check meta description length"], "Enter Meta Description", "Enter your meta description to check SEO compliance...", "textarea", "table"),
  tool("keyword-density-checker", "Keyword Density Checker", "Calculate keyword density percentage in your content", "seo-tools", ["keyword density checker online free", "seo keyword frequency analyzer", "check keyword density tool"], "Enter Your Content", "Paste your article content to analyze keyword density...", "textarea", "table"),
  tool("slug-generator", "SEO Slug Generator", "Generate SEO-friendly URL slugs from page titles", "seo-tools", ["seo slug generator online free", "url slug creator tool", "clean url generator seo"], "Enter Page Title", "Type your page title to generate an SEO-friendly slug...", "text", "text"),
  tool("title-tag-generator", "Title Tag Generator", "Generate optimized HTML title tags for web pages", "seo-tools", ["title tag generator online free", "seo title tag creator tool", "html meta title generator"], "Enter Topic & Brand", "Enter your topic and brand name to generate title tags...", "dual", "list", { dualLabels: ["Topic/Keyword", "Brand Name"] }),
  tool("og-tag-generator", "Open Graph Tag Generator", "Generate complete Open Graph meta tags for social sharing", "seo-tools", ["open graph tag generator online free", "og meta tag creator tool", "facebook og tags generator"], "Enter Page Details", "Enter title, description and image URL for OG tags...", "textarea", "code"),
  tool("canonical-url-checker", "Canonical URL Checker", "Validate and generate canonical URL tags", "seo-tools", ["canonical url checker online free", "canonical tag generator tool", "check canonical url seo"], "Enter URL", "Enter your page URL to generate canonical tag...", "text", "code"),
  tool("robots-txt-generator", "Robots.txt Generator", "Generate a perfectly formatted robots.txt file", "seo-tools", ["robots.txt generator online free", "create robots txt file tool", "seo robots file generator"], "Enter Domain", "Enter your domain to generate robots.txt...", "text", "code"),
  tool("sitemap-url-formatter", "Sitemap URL Formatter", "Format and validate URLs for XML sitemaps", "seo-tools", ["sitemap url formatter online free", "xml sitemap url tool", "sitemap generator url format"], "Enter URLs", "Enter one URL per line to format for sitemap...", "textarea", "code"),
  tool("keyword-extractor", "Keyword Extractor", "Extract the most important keywords from any text", "seo-tools", ["keyword extractor online free", "extract keywords from text tool", "important words finder seo"], "Enter Your Content", "Paste content to extract important SEO keywords...", "textarea", "list"),
  tool("readability-score", "Readability Score Calculator", "Calculate Flesch-Kincaid readability score of your content", "seo-tools", ["readability score calculator online free", "flesch kincaid score tool", "content readability analyzer"], "Enter Your Content", "Paste content to get detailed readability analysis...", "textarea", "table"),
  tool("long-tail-keyword-generator", "Long-Tail Keyword Generator", "Generate 50+ long-tail keyword variations from a seed keyword", "seo-tools", ["long tail keyword generator online free", "keyword variation tool", "seo long tail phrase generator"], "Enter Seed Keyword", "Enter a main keyword to generate long-tail variations...", "text", "list"),
  tool("schema-markup-generator", "JSON-LD Schema Markup Generator", "Generate structured data JSON-LD markup for search engines", "seo-tools", ["schema markup generator online free", "json ld generator tool", "structured data creator seo"], "Enter Page Type", "Enter your page type (Article, Product, FAQ, etc.)...", "select", "code", { selectOptions: ["Article", "Product", "FAQ Page", "How-To", "Local Business", "Person", "Organization", "Recipe", "Event", "Review"] }),
  tool("heading-structure-analyzer", "Heading Structure Analyzer", "Analyze H1-H6 heading hierarchy in HTML content", "seo-tools", ["heading structure analyzer online free", "h1 h2 h3 checker tool", "html heading hierarchy analyzer seo"], "Enter HTML or Text", "Paste HTML or content to analyze heading structure...", "textarea", "table"),
  tool("lsi-keyword-finder", "LSI Keyword Finder", "Find Latent Semantic Indexing keywords for better SEO", "seo-tools", ["lsi keyword finder online free", "semantic keyword generator tool", "related keyword finder seo"], "Enter Main Keyword", "Enter your target keyword to find LSI keywords...", "text", "list"),
];

// ─── MATH TOOLS ─────────────────────────────────────────────
const MATH_TOOLS: ToolMeta[] = [
  tool("percentage-calculator", "Percentage Calculator", "Calculate percentages, discounts and percentage changes instantly", "math-tools", ["percentage calculator online free", "calculate percentage of number tool", "discount percentage calculator"], "Enter Calculation", "e.g., 'What is 15% of 200?' or '25 out of 80 is what %?'", "text", "number"),
  tool("fraction-calculator", "Fraction Calculator", "Add, subtract, multiply and divide fractions with steps", "math-tools", ["fraction calculator online free", "add fractions tool", "fraction arithmetic calculator"], "Enter Fractions", "e.g., '1/2 + 3/4' or '2/3 * 5/6'...", "text", "table"),
  tool("prime-number-checker", "Prime Number Checker", "Check if any number is prime and find prime factors", "math-tools", ["prime number checker online free", "is it a prime number tool", "prime factorization calculator"], "Enter a Number", "Enter any positive integer to check if it's prime...", "number", "text"),
  tool("gcd-lcm-calculator", "GCD & LCM Calculator", "Find Greatest Common Divisor and Least Common Multiple", "math-tools", ["gcd lcm calculator online free", "greatest common divisor tool", "least common multiple calculator"], "Enter Numbers", "Enter two or more numbers separated by commas...", "text", "table"),
  tool("factorial-calculator", "Factorial Calculator", "Calculate factorial of any number (n!)", "math-tools", ["factorial calculator online free", "calculate n factorial tool", "large factorial computation"], "Enter Number", "Enter a non-negative integer to calculate factorial...", "number", "number"),
  tool("fibonacci-generator", "Fibonacci Sequence Generator", "Generate Fibonacci number sequences up to N terms", "math-tools", ["fibonacci sequence generator online free", "fibonacci number calculator tool", "generate fibonacci series"], "Number of Terms", "Enter how many Fibonacci numbers to generate (1-100)...", "number", "list"),
  tool("quadratic-solver", "Quadratic Equation Solver", "Solve ax² + bx + c = 0 equations with full working", "math-tools", ["quadratic equation solver online free", "solve quadratic formula tool", "ax2 bx c calculator"], "Enter Coefficients", "Enter a, b, c values (e.g., '1,-5,6' for x²-5x+6=0)...", "text", "table"),
  tool("scientific-notation", "Scientific Notation Converter", "Convert numbers to and from scientific notation", "math-tools", ["scientific notation converter online free", "convert to scientific notation tool", "standard form calculator"], "Enter Number", "Enter a number to convert to/from scientific notation...", "text", "text"),
  tool("roman-numeral-converter", "Roman Numeral Converter", "Convert between Roman numerals and standard numbers", "math-tools", ["roman numeral converter online free", "number to roman numeral tool", "convert roman numerals"], "Enter Number or Roman Numeral", "Enter a number (e.g., 2024) or Roman numeral (e.g., MMXXIV)...", "text", "text"),
  tool("average-calculator", "Average Calculator", "Calculate mean, median, mode and range of numbers", "math-tools", ["average calculator online free", "mean median mode calculator", "statistics average tool"], "Enter Numbers", "Enter numbers separated by commas (e.g., 5,10,15,20)...", "text", "table"),
  tool("bmi-calculator-math", "BMI Calculator", "Calculate Body Mass Index from height and weight", "math-tools", ["bmi calculator online free", "body mass index calculator tool", "weight height bmi check"], "Enter Height & Weight", "Height (cm), Weight (kg) — e.g., '175,70'...", "text", "table"),
  tool("power-calculator", "Power & Exponent Calculator", "Calculate any base raised to any exponent power", "math-tools", ["power calculator online free", "exponent calculator tool", "base exponent computation"], "Enter Base^Exponent", "e.g., '2^10' or '3^5'...", "text", "number"),
  tool("square-root-calculator", "Square Root Calculator", "Calculate square root and nth root of any number", "math-tools", ["square root calculator online free", "nth root calculator tool", "calculate sqrt online"], "Enter Number", "Enter a number to find its square root...", "number", "number"),
  tool("log-calculator", "Logarithm Calculator", "Calculate log base 2, 10, e and custom base logarithms", "math-tools", ["logarithm calculator online free", "log base 10 calculator tool", "natural log ln calculator"], "Enter Number", "Enter number and base (e.g., '1000,10' for log10(1000))...", "text", "table"),
  tool("modulo-calculator", "Modulo Calculator", "Calculate modulo remainder for any two numbers", "math-tools", ["modulo calculator online free", "mod operation calculator tool", "remainder division calculator"], "Enter Calculation", "e.g., '17 mod 5' or '100 % 13'...", "text", "number"),
];

// ─── COLOR TOOLS ─────────────────────────────────────────────
const COLOR_TOOLS: ToolMeta[] = [
  tool("hex-to-rgb", "HEX to RGB Converter", "Convert hexadecimal color codes to RGB values", "color-tools", ["hex to rgb converter online free", "hex color to rgb tool", "convert hex color code to rgb"], "Enter HEX Color", "#FF5733 or FF5733...", "text", "color"),
  tool("rgb-to-hex", "RGB to HEX Converter", "Convert RGB color values to hexadecimal color codes", "color-tools", ["rgb to hex converter online free", "rgb color to hex tool", "convert rgb to hex code"], "Enter RGB Values", "255, 87, 51 or rgb(255,87,51)...", "text", "color"),
  tool("color-palette-generator", "Color Palette Generator", "Generate beautiful color palettes from a base color", "color-tools", ["color palette generator online free", "create color scheme tool", "color combination generator"], "Enter Base HEX Color", "#3B82F6 — Enter your base color...", "text", "color"),
  tool("hsl-to-rgb", "HSL to RGB Converter", "Convert HSL color values to RGB format", "color-tools", ["hsl to rgb converter online free", "convert hsl color to rgb", "hsl rgb color tool"], "Enter HSL Values", "hsl(210, 90%, 60%) or 210, 90, 60...", "text", "color"),
  tool("color-contrast-checker", "Color Contrast Checker", "Check WCAG contrast ratio for accessibility compliance", "color-tools", ["color contrast checker online free", "wcag contrast ratio tool", "accessibility color contrast checker"], "Enter Two Colors", "Foreground: #FFFFFF, Background: #000000...", "text", "table"),
  tool("random-color-generator", "Random Color Generator", "Generate random colors with HEX, RGB and HSL values", "color-tools", ["random color generator online free", "random hex color tool", "generate random color codes"], "Number of Colors", "How many random colors to generate? (1-20)...", "number", "color"),
  tool("gradient-generator", "CSS Gradient Generator", "Generate beautiful CSS linear and radial gradients", "color-tools", ["css gradient generator online free", "linear gradient creator tool", "background gradient code generator"], "Enter Two Colors", "#FF6B6B, #4ECDC4 — Enter gradient colors...", "text", "code"),
  tool("color-name-finder", "Color Name Finder", "Find the closest named color for any HEX or RGB value", "color-tools", ["color name finder online free", "find color name from hex", "nearest named color tool"], "Enter Color Code", "#E74C3C — Enter HEX to find the color name...", "text", "text"),
  tool("tint-shade-generator", "Tint & Shade Generator", "Generate tints (lighter) and shades (darker) of any color", "color-tools", ["tint shade generator online free", "color tint generator tool", "lighter darker color generator"], "Enter Base Color", "#3B82F6 — Enter your base color...", "text", "color"),
  tool("cmyk-to-rgb", "CMYK to RGB Converter", "Convert CMYK print color values to RGB screen format", "color-tools", ["cmyk to rgb converter online free", "convert cmyk to rgb tool", "print color to screen color converter"], "Enter CMYK Values", "C:0 M:66 Y:79 K:6 or 0,66,79,6...", "text", "color"),
];

// ─── DEVELOPER TOOLS ─────────────────────────────────────────
const DEVELOPER_TOOLS: ToolMeta[] = [
  tool("json-formatter", "JSON Formatter & Beautifier", "Format, beautify and validate JSON data instantly", "developer-tools", ["json formatter online free", "beautify json tool", "validate json online"], "Paste JSON", "Paste your JSON data here to format and validate...", "textarea", "code"),
  tool("json-minifier", "JSON Minifier", "Minify and compress JSON data to reduce file size", "developer-tools", ["json minifier online free", "compress json tool", "minify json data"], "Paste JSON", "Paste your JSON to minify and compress...", "textarea", "code"),
  tool("javascript-minifier", "JavaScript Minifier", "Minify JavaScript code to reduce bundle size", "developer-tools", ["javascript minifier online free", "minify js code tool", "compress javascript online"], "Paste JavaScript Code", "Paste your JS code to minify...", "textarea", "code"),
  tool("css-minifier", "CSS Minifier", "Minify CSS stylesheets to optimize page load speed", "developer-tools", ["css minifier online free", "minify css stylesheet tool", "compress css code online"], "Paste CSS Code", "Paste your CSS to minify and compress...", "textarea", "code"),
  tool("html-minifier", "HTML Minifier", "Minify HTML markup to reduce page size", "developer-tools", ["html minifier online free", "compress html code tool", "minify html markup online"], "Paste HTML Code", "Paste your HTML to minify...", "textarea", "code"),
  tool("regex-tester", "Regex Tester", "Test regular expressions against strings in real-time", "developer-tools", ["regex tester online free", "regular expression tester tool", "test regex patterns online"], "Regex Pattern", "/your-pattern/flags — Enter regex and test string...", "dual", "list", { dualLabels: ["Regex Pattern", "Test String"] }),
  tool("uuid-generator", "UUID Generator", "Generate RFC 4122 compliant UUID/GUID identifiers", "developer-tools", ["uuid generator online free", "generate guid tool", "random uuid creator"], "Number of UUIDs", "How many UUIDs to generate? (1-100)...", "number", "list"),
  tool("hash-generator", "Hash Generator (MD5/SHA)", "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes", "developer-tools", ["hash generator online free", "md5 sha256 hash tool", "generate text hash online"], "Enter Text to Hash", "Type or paste text to generate cryptographic hashes...", "textarea", "table"),
  tool("base64-encoder", "Base64 Encoder", "Encode text or data to Base64 format", "developer-tools", ["base64 encoder online free", "encode text to base64 tool", "text to base64 converter"], "Enter Text to Encode", "Paste text to encode to Base64...", "textarea", "text"),
  tool("base64-decoder", "Base64 Decoder", "Decode Base64 encoded strings back to plain text", "developer-tools", ["base64 decoder online free", "decode base64 string tool", "base64 to text converter"], "Enter Base64 String", "Paste Base64 encoded string to decode...", "textarea", "text"),
  tool("url-encoder", "URL Encoder", "Encode special characters in URLs (percent-encoding)", "developer-tools", ["url encoder online free", "percent encode url tool", "encode url string online"], "Enter URL or Text", "Paste URL or text to encode special characters...", "textarea", "text"),
  tool("url-decoder", "URL Decoder", "Decode percent-encoded URL strings to readable format", "developer-tools", ["url decoder online free", "decode url string tool", "percent decode url online"], "Enter Encoded URL", "Paste encoded URL to decode it...", "textarea", "text"),
  tool("cron-expression-generator", "Cron Expression Generator", "Build cron schedule expressions with a visual helper", "developer-tools", ["cron expression generator online free", "cron job scheduler tool", "build cron expression"], "Describe Your Schedule", "e.g., 'every day at 9am' or 'every Monday at midnight'...", "text", "code"),
  tool("ip-address-validator", "IP Address Validator", "Validate IPv4 and IPv6 addresses and get details", "developer-tools", ["ip address validator online free", "validate ip address tool", "check ip format online"], "Enter IP Address", "Enter an IPv4 or IPv6 address to validate...", "text", "table"),
  tool("jwt-decoder", "JWT Decoder", "Decode and inspect JWT tokens without verification", "developer-tools", ["jwt decoder online free", "decode jwt token tool", "inspect jwt payload online"], "Enter JWT Token", "Paste your JWT token to decode its payload...", "textarea", "code"),
];

// ─── UNIT CONVERTER TOOLS ────────────────────────────────────
const UNIT_TOOLS: ToolMeta[] = [
  tool("length-converter", "Length & Distance Converter", "Convert between meters, feet, inches, miles, km and more", "unit-converter", ["length converter online free", "distance unit converter tool", "meters to feet converter"], "Enter Length", "e.g., '100 meters to feet' or '5 miles to km'...", "text", "table"),
  tool("weight-converter", "Weight & Mass Converter", "Convert kg, pounds, ounces, grams, tons and more", "unit-converter", ["weight converter online free", "kg to pounds converter tool", "mass unit conversion calculator"], "Enter Weight", "e.g., '70 kg to pounds' or '150 lbs to kg'...", "text", "table"),
  tool("temperature-converter", "Temperature Converter", "Convert Celsius, Fahrenheit, Kelvin and Rankine", "unit-converter", ["temperature converter online free", "celsius to fahrenheit tool", "kelvin converter calculator"], "Enter Temperature", "e.g., '100 celsius to fahrenheit' or '212°F to C'...", "text", "table"),
  tool("area-converter", "Area Converter", "Convert between square meters, acres, hectares, sq ft and more", "unit-converter", ["area converter online free", "square meters to acres tool", "land area conversion calculator"], "Enter Area", "e.g., '1 acre to square meters' or '500 sq ft to m2'...", "text", "table"),
  tool("volume-converter", "Volume & Liquid Converter", "Convert liters, gallons, cups, pints, fluid ounces and more", "unit-converter", ["volume converter online free", "liters to gallons converter tool", "liquid measurement converter"], "Enter Volume", "e.g., '1 gallon to liters' or '500 ml to cups'...", "text", "table"),
  tool("speed-converter", "Speed Converter", "Convert mph, kph, m/s, knots and other speed units", "unit-converter", ["speed converter online free", "mph to kph converter tool", "speed unit conversion calculator"], "Enter Speed", "e.g., '60 mph to kph' or '100 km/h to m/s'...", "text", "table"),
  tool("time-converter", "Time Unit Converter", "Convert seconds, minutes, hours, days, weeks, years", "unit-converter", ["time unit converter online free", "seconds to hours converter tool", "time conversion calculator"], "Enter Time", "e.g., '3600 seconds to hours' or '2 weeks to days'...", "text", "table"),
  tool("data-size-converter", "Data Storage Converter", "Convert between bytes, KB, MB, GB, TB and more", "unit-converter", ["data storage converter online free", "bytes to megabytes tool", "file size unit converter"], "Enter Data Size", "e.g., '1 GB to MB' or '2048 bytes to KB'...", "text", "table"),
  tool("pressure-converter", "Pressure Converter", "Convert PSI, bar, pascal, atmosphere and more units", "unit-converter", ["pressure converter online free", "psi to bar converter tool", "pressure unit conversion calculator"], "Enter Pressure", "e.g., '14.7 psi to bar' or '1 atm to pascal'...", "text", "table"),
  tool("energy-converter", "Energy Converter", "Convert joules, calories, BTU, kWh and energy units", "unit-converter", ["energy converter online free", "joules to calories converter tool", "energy unit conversion calculator"], "Enter Energy", "e.g., '1000 joules to calories' or '1 kWh to BTU'...", "text", "table"),
];

// ─── PASSWORD & SECURITY TOOLS ───────────────────────────────
const PASSWORD_TOOLS: ToolMeta[] = [
  tool("password-generator", "Strong Password Generator", "Generate cryptographically secure random passwords", "password-tools", ["password generator online free", "strong random password creator tool", "secure password generator"], "Password Options", "Length (8-128), Include: uppercase, numbers, symbols...", "text", "text"),
  tool("password-strength-checker", "Password Strength Checker", "Analyze password strength and crack time estimation", "password-tools", ["password strength checker online free", "how strong is my password tool", "password security analyzer"], "Enter Password", "Type your password to check its strength...", "text", "table"),
  tool("passphrase-generator", "Passphrase Generator", "Generate memorable passphrases for secure authentication", "password-tools", ["passphrase generator online free", "random passphrase creator tool", "memorable password generator"], "Number of Words", "Enter number of words for passphrase (4-10)...", "number", "text"),
  tool("hash-password-checker", "Password Hash Identifier", "Identify the hash algorithm used for a password hash", "password-tools", ["password hash identifier online free", "identify hash type tool", "hash algorithm detector"], "Enter Hash String", "Paste a hash string to identify its algorithm...", "text", "text"),
  tool("pin-generator", "Secure PIN Generator", "Generate secure random PIN numbers for authentication", "password-tools", ["pin number generator online free", "random pin generator tool", "secure pin creator"], "PIN Length", "Enter desired PIN length (4-12 digits)...", "number", "text"),
];

// ─── ENCODING TOOLS ─────────────────────────────────────────
const ENCODING_TOOLS: ToolMeta[] = [
  tool("html-encoder", "HTML Entity Encoder", "Encode special characters to HTML entities", "encoding-tools", ["html encoder online free", "html entity encoder tool", "encode special characters html"], "Enter HTML Content", "Paste HTML or text with special characters to encode...", "textarea", "text"),
  tool("html-decoder", "HTML Entity Decoder", "Decode HTML entities back to readable characters", "encoding-tools", ["html decoder online free", "html entity decoder tool", "decode html entities online"], "Enter Encoded HTML", "Paste HTML-encoded text to decode...", "textarea", "text"),
  tool("uri-component-encoder", "URI Component Encoder", "Encode URI components using encodeURIComponent rules", "encoding-tools", ["uri component encoder online free", "encode uri component tool", "url component encoder online"], "Enter Text", "Enter text or URI component to encode...", "textarea", "text"),
  tool("morse-encoder", "Advanced Morse Code Encoder", "Encode text to standard Morse code", "encoding-tools", ["morse code encoder online free", "text to morse code tool", "encode message in morse"], "Enter Text", "Enter any text to encode into Morse code...", "textarea", "text"),
  tool("binary-encoder", "Binary Encoder/Decoder", "Encode text to binary and decode binary to text", "encoding-tools", ["binary encoder decoder online free", "text to binary encoder tool", "binary code converter online"], "Enter Text or Binary", "Enter text to encode or binary (0s and 1s) to decode...", "textarea", "text"),
];

// ─── RANDOM GENERATORS ──────────────────────────────────────
const RANDOM_TOOLS: ToolMeta[] = [
  tool("random-number-generator", "Random Number Generator", "Generate random numbers within any specified range", "random-generators", ["random number generator online free", "generate random numbers tool", "random integer generator"], "Enter Range", "Min: 1, Max: 100 (enter as '1,100')...", "text", "number"),
  tool("random-name-generator", "Random Name Generator", "Generate random first, last and full names for any purpose", "random-generators", ["random name generator online free", "fake name generator tool", "random person name creator"], "Number of Names", "How many random names to generate? (1-50)...", "number", "list"),
  tool("dice-roller", "Dice Roller Simulator", "Roll any type of dice (d4, d6, d8, d10, d12, d20)", "random-generators", ["dice roller online free", "virtual dice roll tool", "random dice simulator"], "Dice Type & Count", "e.g., '3d6' or '1d20' or '2d8'...", "text", "table"),
  tool("coin-flipper", "Coin Flip Simulator", "Flip a virtual coin and get heads or tails results", "random-generators", ["coin flip online free", "virtual coin toss tool", "heads or tails generator"], "Number of Flips", "How many times to flip the coin? (1-100)...", "number", "table"),
  tool("random-list-picker", "Random List Item Picker", "Pick random items from any list you provide", "random-generators", ["random list picker online free", "random item selector tool", "pick random from list generator"], "Enter Your List", "Enter items one per line and we'll pick one randomly...", "textarea", "text"),
  tool("random-color-picker", "Random Color Picker", "Pick a completely random color with HEX, RGB and HSL values", "random-generators", ["random color picker online free", "random hex color tool", "generate random color online"], "Number of Colors", "How many random colors to generate?...", "number", "color"),
  tool("random-word-generator", "Random Word Generator", "Generate random English words from various categories", "random-generators", ["random word generator online free", "random english word tool", "vocabulary word generator"], "Word Count", "How many random words to generate? (1-50)...", "number", "list"),
  tool("random-date-generator", "Random Date Generator", "Generate random dates within a specified range", "random-generators", ["random date generator online free", "generate random dates tool", "random calendar date picker"], "Date Range", "e.g., '2020-01-01 to 2024-12-31'...", "text", "list"),
];

// ─── FINANCE TOOLS ──────────────────────────────────────────
const FINANCE_TOOLS: ToolMeta[] = [
  tool("compound-interest-calculator", "Compound Interest Calculator", "Calculate compound interest with detailed yearly breakdown", "finance-tools", ["compound interest calculator online free", "compound interest formula tool", "investment growth calculator"], "Enter Details", "Principal, Rate(%), Years — e.g., '10000,5,10'...", "text", "table"),
  tool("simple-interest-calculator", "Simple Interest Calculator", "Calculate simple interest and total repayment amount", "finance-tools", ["simple interest calculator online free", "si formula calculator tool", "basic interest rate calculator"], "Enter P,R,T", "Principal, Rate(%), Time(years) — e.g., '5000,8,3'...", "text", "table"),
  tool("loan-emi-calculator", "Loan EMI Calculator", "Calculate monthly EMI for home, car or personal loans", "finance-tools", ["loan emi calculator online free", "monthly emi calculator tool", "home loan payment calculator"], "Enter Loan Details", "Amount, Rate(%), Tenure(months) — e.g., '500000,8.5,240'...", "text", "table"),
  tool("gst-calculator", "GST Calculator", "Calculate GST amount, inclusive and exclusive of tax", "finance-tools", ["gst calculator online free", "goods service tax calculator tool", "add remove gst calculator"], "Enter Amount & Rate", "Amount and GST rate — e.g., '1000,18'...", "text", "table"),
  tool("tip-calculator", "Tip Calculator", "Calculate tip amount and split bills between people", "finance-tools", ["tip calculator online free", "restaurant bill tip tool", "split bill calculator"], "Bill Amount & Tip %", "Bill amount, tip% and number of people — e.g., '150,18,4'...", "text", "table"),
  tool("currency-converter-mock", "Currency Converter", "Convert between major world currencies with mock rates", "finance-tools", ["currency converter online free", "usd to eur converter tool", "foreign exchange rate calculator"], "Enter Amount & Currencies", "e.g., '100 USD to EUR' or '500 GBP to INR'...", "text", "table"),
  tool("roi-calculator", "ROI Calculator", "Calculate Return on Investment percentage for any project", "finance-tools", ["roi calculator online free", "return on investment formula tool", "investment roi percentage calculator"], "Enter Investment Details", "Investment and Return — e.g., '50000,65000'...", "text", "table"),
  tool("discount-calculator", "Discount Calculator", "Calculate final price after percentage discount", "finance-tools", ["discount calculator online free", "percent off price tool", "sale price discount calculator"], "Original Price & Discount %", "e.g., '599.99,25' for 25% off $599.99...", "text", "table"),
];

// ─── HEALTH TOOLS ───────────────────────────────────────────
const HEALTH_TOOLS: ToolMeta[] = [
  tool("bmi-calculator", "BMI Calculator", "Calculate BMI and find your healthy weight range", "health-tools", ["bmi calculator online free", "body mass index tool", "healthy weight calculator bmi"], "Enter Height & Weight", "Height(cm), Weight(kg) — e.g., '175,70'...", "text", "table"),
  tool("calorie-calculator", "Daily Calorie Calculator", "Calculate daily calorie needs based on activity level", "health-tools", ["calorie calculator online free", "daily calorie needs tool", "tdee calculator free online"], "Enter Details", "Age, Gender(M/F), Height(cm), Weight(kg), Activity(1-5) — e.g., '25,M,175,70,3'...", "text", "table"),
  tool("water-intake-calculator", "Water Intake Calculator", "Calculate recommended daily water intake for your body", "health-tools", ["water intake calculator online free", "how much water should i drink tool", "daily hydration calculator"], "Enter Your Weight", "Weight(kg) and activity level — e.g., '70,active'...", "text", "table"),
  tool("ideal-weight-calculator", "Ideal Weight Calculator", "Calculate your ideal body weight using multiple formulas", "health-tools", ["ideal weight calculator online free", "healthy weight for height tool", "target weight calculator bmi"], "Enter Height & Gender", "Height(cm), Gender(M/F) — e.g., '175,M'...", "text", "table"),
  tool("heart-rate-zones", "Heart Rate Zone Calculator", "Calculate target heart rate zones for optimal training", "health-tools", ["heart rate zone calculator online free", "target heart rate tool", "cardio zone calculator fitness"], "Enter Age", "Enter your age to calculate heart rate zones...", "number", "table"),
];

// ─── WRITING TOOLS ──────────────────────────────────────────
const WRITING_TOOLS: ToolMeta[] = [
  tool("headline-generator", "Blog Headline Generator", "Generate click-worthy blog headlines for any topic", "writing-tools", ["blog headline generator online free", "catchy title generator tool", "seo blog title creator"], "Enter Your Topic", "Enter your blog topic to generate headlines...", "text", "list"),
  tool("essay-outline-generator", "Essay Outline Generator", "Create structured essay outlines with introduction and points", "writing-tools", ["essay outline generator online free", "essay structure tool", "write essay outline creator"], "Enter Essay Topic", "Enter your essay topic to generate a structured outline...", "text", "list"),
  tool("rhyme-finder", "Rhyme Finder", "Find perfect rhymes for any English word", "writing-tools", ["rhyme finder online free", "find rhyming words tool", "word rhyme generator poetry"], "Enter a Word", "Enter a word to find rhyming words...", "text", "list"),
  tool("syllable-counter", "Syllable Counter", "Count syllables in words and phrases for poetry", "writing-tools", ["syllable counter online free", "count syllables in word tool", "syllable checker poetry tool"], "Enter Word or Text", "Enter words or phrases to count syllables...", "text", "table"),
  tool("paraphrasing-helper", "Paraphrasing Tips Helper", "Get tips and suggestions on paraphrasing techniques", "writing-tools", ["paraphrasing helper online free", "paraphrase text tips tool", "rewrite sentence guide"], "Enter Sentence", "Enter a sentence to get paraphrasing suggestions...", "textarea", "list"),
];

// ─── SOCIAL MEDIA TOOLS ────────────────────────────────────
const SOCIAL_TOOLS: ToolMeta[] = [
  tool("hashtag-generator", "Hashtag Generator", "Generate trending hashtags for Instagram, Twitter and TikTok", "social-media-tools", ["hashtag generator online free", "instagram hashtag tool", "twitter trending hashtag generator"], "Enter Topic or Keyword", "Enter your content topic to generate relevant hashtags...", "text", "list"),
  tool("bio-generator", "Social Media Bio Generator", "Generate engaging social media bios for any platform", "social-media-tools", ["social media bio generator online free", "instagram bio creator tool", "twitter bio generator free"], "Describe Yourself", "Your name, profession, interests — e.g., 'Hassan, Developer, Coffee lover'...", "text", "list"),
  tool("tweet-character-counter", "Tweet Character Counter", "Count characters and check tweet length compliance", "social-media-tools", ["tweet character counter online free", "twitter character limit tool", "check tweet length online"], "Enter Your Tweet", "Type your tweet to count characters (280 limit)...", "textarea", "table"),
  tool("engagement-rate-calculator", "Engagement Rate Calculator", "Calculate social media engagement rate for any post", "social-media-tools", ["engagement rate calculator online free", "social media engagement tool", "instagram engagement calculator"], "Enter Stats", "Likes, Comments, Shares, Followers — e.g., '1500,200,50,50000'...", "text", "table"),
  tool("youtube-tag-generator", "YouTube Tag Generator", "Generate SEO-optimized tags for YouTube videos", "social-media-tools", ["youtube tag generator online free", "youtube video tags tool", "seo youtube tags creator"], "Enter Video Topic", "Enter your YouTube video topic to generate tags...", "text", "list"),
];

// ─── JSON TOOLS ────────────────────────────────────────────
const JSON_TOOLS: ToolMeta[] = [
  tool("json-validator", "JSON Validator", "Validate JSON syntax and identify formatting errors", "json-tools", ["json validator online free", "validate json syntax tool", "json format checker"], "Paste JSON", "Paste your JSON here to validate the syntax...", "textarea", "text"),
  tool("json-to-csv", "JSON to CSV Converter", "Convert JSON arrays to CSV format for spreadsheets", "json-tools", ["json to csv converter online free", "convert json to spreadsheet tool", "json csv export tool"], "Paste JSON Array", "Paste a JSON array to convert to CSV format...", "textarea", "text"),
  tool("json-to-xml", "JSON to XML Converter", "Convert JSON data to XML format for APIs and feeds", "json-tools", ["json to xml converter online free", "convert json to xml tool", "json xml data converter"], "Paste JSON", "Paste your JSON to convert to XML...", "textarea", "code"),
  tool("json-path-finder", "JSON Path Finder", "Query JSON data using JSONPath expressions", "json-tools", ["json path finder online free", "jsonpath query tool", "json data extractor online"], "Paste JSON", "Paste JSON and query with JSONPath expressions...", "dual", "text", { dualLabels: ["JSON Data", "JSONPath Query"] }),
  tool("json-diff", "JSON Diff Checker", "Compare two JSON objects and highlight differences", "json-tools", ["json diff checker online free", "compare json objects tool", "json comparison tool"], "Paste JSON Objects", "Paste two JSON objects to compare differences...", "dual", "text", { dualLabels: ["JSON Object 1", "JSON Object 2"] }),
];

// ─── CSS TOOLS ─────────────────────────────────────────────
const CSS_TOOLS: ToolMeta[] = [
  tool("box-shadow-generator", "Box Shadow Generator", "Generate CSS box-shadow code with visual preview", "css-tools", ["css box shadow generator online free", "box shadow creator tool", "create css shadow effect"], "Enter Shadow Config", "x-offset, y-offset, blur, spread, color — e.g., '0,4,6,-1,rgba(0,0,0,0.1)'...", "text", "code"),
  tool("border-radius-generator", "Border Radius Generator", "Generate CSS border-radius for custom shapes", "css-tools", ["border radius generator online free", "css border radius tool", "rounded corners css creator"], "Enter Radius Values", "TL, TR, BR, BL — e.g., '10,20,10,20' or '50' for circle...", "text", "code"),
  tool("flexbox-generator", "Flexbox Code Generator", "Generate CSS flexbox layout code visually", "css-tools", ["flexbox generator online free", "css flexbox code tool", "flex container property generator"], "Describe Layout", "e.g., 'centered items, horizontal, wrap'...", "text", "code"),
  tool("animation-generator", "CSS Animation Generator", "Generate CSS @keyframes animation code snippets", "css-tools", ["css animation generator online free", "keyframes animation tool", "create css animation code"], "Describe Animation", "e.g., 'fade in', 'slide left', 'bounce', 'rotate'...", "text", "code"),
  tool("media-query-generator", "Media Query Generator", "Generate responsive CSS media queries for breakpoints", "css-tools", ["media query generator online free", "responsive css breakpoint tool", "css media query creator"], "Enter Breakpoint", "Enter breakpoint width (e.g., 768, 1024, 1440)...", "number", "code"),
];

// ─── CRYPTO TOOLS ──────────────────────────────────────────
const CRYPTO_TOOLS: ToolMeta[] = [
  tool("md5-generator", "MD5 Hash Generator", "Generate MD5 hash of any text or string", "crypto-tools", ["md5 hash generator online free", "generate md5 checksum tool", "text to md5 hash online"], "Enter Text", "Enter text to generate MD5 hash...", "textarea", "text"),
  tool("sha256-generator", "SHA-256 Hash Generator", "Generate SHA-256 cryptographic hash of any text", "crypto-tools", ["sha256 hash generator online free", "sha256 checksum generator tool", "text to sha256 online"], "Enter Text", "Enter text to generate SHA-256 hash...", "textarea", "text"),
  tool("sha512-generator", "SHA-512 Hash Generator", "Generate SHA-512 cryptographic hash of any text", "crypto-tools", ["sha512 hash generator online free", "sha512 checksum tool", "generate sha512 hash online"], "Enter Text", "Enter text to generate SHA-512 hash...", "textarea", "text"),
  tool("crc32-generator", "CRC32 Checksum Calculator", "Calculate CRC32 checksum for data integrity verification", "crypto-tools", ["crc32 checksum calculator online free", "crc32 hash generator tool", "file integrity crc checker"], "Enter Text", "Enter text to calculate CRC32 checksum...", "textarea", "text"),
  tool("hmac-generator", "HMAC Generator", "Generate HMAC message authentication codes", "crypto-tools", ["hmac generator online free", "hmac sha256 tool", "message authentication code generator"], "Enter Message & Key", "Message, Secret Key — e.g., 'Hello World,mysecretkey'...", "text", "text"),
];

// ─── BINARY TOOLS ──────────────────────────────────────────
const BINARY_TOOLS: ToolMeta[] = [
  tool("decimal-to-binary", "Decimal to Binary Converter", "Convert decimal numbers to binary (base 2) format", "binary-tools", ["decimal to binary converter online free", "number to binary tool", "convert decimal binary online"], "Enter Decimal Number", "Enter a decimal number to convert to binary...", "text", "text"),
  tool("binary-to-decimal", "Binary to Decimal Converter", "Convert binary numbers back to decimal format", "binary-tools", ["binary to decimal converter online free", "decode binary number tool", "convert binary to decimal online"], "Enter Binary Number", "Enter binary number (0s and 1s) to convert to decimal...", "text", "text"),
  tool("hex-to-decimal", "HEX to Decimal Converter", "Convert hexadecimal to decimal number format", "binary-tools", ["hex to decimal converter online free", "hexadecimal to number tool", "convert hex to decimal online"], "Enter HEX Number", "Enter hexadecimal (e.g., FF, 1A3F) to convert to decimal...", "text", "text"),
  tool("decimal-to-hex", "Decimal to HEX Converter", "Convert decimal numbers to hexadecimal format", "binary-tools", ["decimal to hex converter online free", "number to hexadecimal tool", "convert decimal to hex online"], "Enter Decimal Number", "Enter a decimal number to convert to hexadecimal...", "text", "text"),
  tool("octal-converter", "Octal Number Converter", "Convert between octal, decimal, binary and hexadecimal", "binary-tools", ["octal converter online free", "octal to decimal tool", "base 8 number converter"], "Enter Number & Base", "e.g., '755,octal' or '255,decimal'...", "text", "table"),
];

// ─── STRING TOOLS ──────────────────────────────────────────
const STRING_TOOLS: ToolMeta[] = [
  tool("string-length-counter", "String Length Counter", "Count the exact length of any string or text", "string-tools", ["string length counter online free", "count string characters tool", "text length calculator online"], "Enter String", "Enter any string to count its length...", "text", "number"),
  tool("string-splitter", "String Splitter", "Split strings by delimiter, character or regex pattern", "string-tools", ["string splitter online free", "split string by delimiter tool", "text string split online"], "Enter String", "String and delimiter — e.g., 'a,b,c' split by ','...", "dual", "list", { dualLabels: ["String", "Delimiter"] }),
  tool("string-joiner", "String Joiner", "Join multiple strings with a custom delimiter", "string-tools", ["string joiner online free", "join strings with delimiter tool", "concatenate text online"], "Enter Lines to Join", "Enter strings one per line to join with a separator...", "textarea", "text"),
  tool("string-replacer", "String Find & Replace", "Find and replace text patterns within strings", "string-tools", ["find replace text online free", "string replacer tool", "text find replace utility"], "Enter Text", "Original text, then specify find and replace values...", "textarea", "text"),
  tool("string-extractor", "String Pattern Extractor", "Extract specific patterns like emails, URLs from text", "string-tools", ["string pattern extractor online free", "extract emails from text tool", "find urls in text extractor"], "Enter Text", "Paste text to extract emails, URLs, phone numbers...", "textarea", "list"),
];

// ─── HTML TOOLS ────────────────────────────────────────────
const HTML_TOOLS: ToolMeta[] = [
  tool("html-to-text", "HTML to Plain Text Converter", "Strip HTML tags and extract clean plain text", "html-tools", ["html to plain text converter online free", "strip html tags tool", "remove html code text extractor"], "Enter HTML Code", "Paste HTML markup to extract plain text...", "textarea", "text"),
  tool("html-formatter", "HTML Formatter & Beautifier", "Format and indent HTML code for readability", "html-tools", ["html formatter online free", "html beautifier tool", "format html code indenter"], "Enter HTML Code", "Paste unformatted HTML to beautify...", "textarea", "code"),
  tool("html-tag-validator", "HTML Tag Validator", "Check HTML for unclosed, malformed or invalid tags", "html-tools", ["html tag validator online free", "check html tags tool", "validate html markup online"], "Enter HTML Code", "Paste HTML to check for invalid or unclosed tags...", "textarea", "list"),
  tool("html-table-generator", "HTML Table Generator", "Generate HTML table code from data", "html-tools", ["html table generator online free", "create html table tool", "table html code generator"], "Enter CSV/Table Data", "Paste CSV or tab-separated data to create HTML table...", "textarea", "code"),
  tool("markdown-to-html", "Markdown to HTML Converter", "Convert Markdown syntax to HTML code", "html-tools", ["markdown to html converter online free", "convert md to html tool", "markdown html generator online"], "Enter Markdown", "Paste your Markdown to convert to HTML...", "textarea", "code"),
];

// ─── AI TOOLS ──────────────────────────────────────────────
const AI_TOOLS: ToolMeta[] = [
  tool("prompt-builder", "AI Prompt Builder", "Build optimized prompts for ChatGPT, Claude and Gemini", "ai-tools", ["ai prompt builder online free", "chatgpt prompt generator tool", "best ai prompt creator"], "Describe Your Task", "Describe what you want the AI to do...", "textarea", "text"),
  tool("prompt-optimizer", "AI Prompt Optimizer", "Optimize and improve existing AI prompts for better results", "ai-tools", ["ai prompt optimizer online free", "improve chatgpt prompt tool", "prompt engineering optimizer"], "Enter Your Prompt", "Paste your existing prompt to optimize it...", "textarea", "text"),
  tool("ai-content-brief", "AI Content Brief Generator", "Generate detailed content briefs for AI writing tools", "ai-tools", ["ai content brief generator online free", "content strategy brief tool", "ai writing guide creator"], "Enter Content Topic", "Enter topic and target audience for content brief...", "text", "list"),
  tool("system-prompt-generator", "System Prompt Generator", "Generate system prompts for custom AI assistants", "ai-tools", ["system prompt generator online free", "ai assistant persona tool", "custom gpt system prompt creator"], "Describe Your AI Role", "Describe what role you want the AI to play...", "textarea", "text"),
  tool("ai-output-formatter", "AI Output Formatter", "Format and clean up raw AI-generated text content", "ai-tools", ["ai output formatter online free", "clean ai text tool", "format chatgpt output online"], "Paste AI Output", "Paste raw AI output to clean and format...", "textarea", "text"),
];

// ─── MISC TOOLS ────────────────────────────────────────────
const MISC_TOOLS: ToolMeta[] = [
  tool("qr-code-data", "QR Code Data Encoder", "Encode data in QR code format (SVG text output)", "misc-tools", ["qr code generator online free", "create qr code tool", "qr code data encoder free"], "Enter Data", "URL, text, or contact info to encode as QR data...", "text", "code"),
  tool("age-calculator", "Age Calculator", "Calculate exact age in years, months, and days", "misc-tools", ["age calculator online free", "calculate exact age tool", "birthday age calculator online"], "Enter Birth Date", "e.g., '1990-05-15' (YYYY-MM-DD)...", "text", "table"),
  tool("day-of-week-finder", "Day of Week Finder", "Find out what day of the week any date falls on", "misc-tools", ["day of week finder online free", "what day was date tool", "calendar day finder online"], "Enter Date", "e.g., '2024-07-04' to find what day it falls on...", "text", "text"),
  tool("countdown-calculator", "Date Countdown Calculator", "Calculate days, hours until any future event", "misc-tools", ["countdown calculator online free", "days until date calculator tool", "event countdown timer online"], "Enter Target Date", "e.g., '2025-12-31' to count days until then...", "text", "table"),
  tool("timezone-converter", "Timezone Converter", "Convert times between world timezones", "misc-tools", ["timezone converter online free", "convert time zones tool", "world clock time converter"], "Enter Time & Zones", "e.g., '14:30 EST to IST'...", "text", "table"),
];

// ─── AGGREGATE ALL TOOLS ───────────────────────────────────
export const ALL_TOOLS: ToolMeta[] = [
  ...TEXT_TOOLS,
  ...SEO_TOOLS,
  ...MATH_TOOLS,
  ...COLOR_TOOLS,
  ...DEVELOPER_TOOLS,
  ...UNIT_TOOLS,
  ...PASSWORD_TOOLS,
  ...ENCODING_TOOLS,
  ...RANDOM_TOOLS,
  ...FINANCE_TOOLS,
  ...HEALTH_TOOLS,
  ...WRITING_TOOLS,
  ...SOCIAL_TOOLS,
  ...BINARY_TOOLS,
  ...STRING_TOOLS,
  ...JSON_TOOLS,
  ...CSS_TOOLS,
  ...CRYPTO_TOOLS,
  ...HTML_TOOLS,
  ...AI_TOOLS,
  ...MISC_TOOLS,
];

// ─── LOOKUP UTILITIES ─────────────────────────────────────
export function getToolBySlug(category: string, slug: string): ToolMeta | undefined {
  return ALL_TOOLS.find(t => t.category === category && t.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return ALL_TOOLS.filter(t => t.category === category);
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

// ─── SYNTHETIC TOOL GENERATOR ────────────────────────────
// Generates deterministic tool metadata for any slug not in the explicit list
export function synthesizeTool(category: string, slug: string): ToolMeta {
  const cat = getCategoryBySlug(category);
  const catName = cat?.name ?? category.replace(/-/g, " ");
  const toolName = slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    name: `${toolName}`,
    description: `Free online ${toolName} tool for ${catName}. Use our instant ${toolName} with no signup required.`,
    category,
    keywords: [
      `${slug.replace(/-/g, " ")} online free`,
      `${slug.replace(/-/g, " ")} tool`,
      `free ${category.replace(/-/g, " ")} ${slug.replace(/-/g, " ")}`,
      `best ${slug.replace(/-/g, " ")} calculator`,
    ],
    inputLabel: `Enter Your ${toolName} Input`,
    inputPlaceholder: `Type or paste your input for the ${toolName} tool...`,
    inputType: "textarea",
    outputType: "text",
  };
}
