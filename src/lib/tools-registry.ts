export const TOOL_CATEGORIES = [
  { id: "organize", name: "Organize PDF", icon: "FolderTree" },
  { id: "optimize", name: "Optimize PDF", icon: "Gauge" },
  { id: "convert-to-pdf", name: "Convert to PDF", icon: "FileInput" },
  { id: "convert-from-pdf", name: "Convert from PDF", icon: "FileOutput" },
  { id: "edit", name: "Edit PDF", icon: "PenTool" },
  { id: "security", name: "Security & Signing", icon: "ShieldCheck" },
  { id: "ai-ocr", name: "AI & OCR", icon: "ScanText" },
  { id: "advanced", name: "Advanced Tools", icon: "Wrench" },
] as const;

export type ToolCategoryId = (typeof TOOL_CATEGORIES)[number]["id"];

export interface PdfTool {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategoryId;
  icon: string;
  keywords: string[];
  acceptedFormats: string[];
  outputFormat: string;
  priority: number;
}

export const TOOLS: PdfTool[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine multiple PDF files into one organized document in seconds.",
    description:
      "Merge PDF is the fastest way to combine two or more PDF documents into a single, perfectly ordered file without ever uploading anything to a remote server. Powered entirely by WebAssembly and the battle-tested pdf-lib library, every page from every source document is copied byte-for-byte directly inside your browser's memory, preserving original formatting, embedded fonts, images, bookmarks, and vector quality. Simply drag and drop your files in any order, use the intuitive thumbnail reordering panel to arrange pages exactly how you want, and click Merge to instantly generate a downloadable combined PDF. This tool is perfect for students merging lecture notes, freelancers combining invoices and contracts, HR teams consolidating resumes, or anyone who needs to bundle scanned receipts into one tidy report. Because processing happens 100% client-side, your sensitive financial statements, legal contracts, or private documents never leave your device, giving you enterprise-grade privacy at zero cost. There are no file size restrictions imposed by server timeouts, no daily usage caps, and no watermarks added to your output. Once your merged file downloads, PDF Lovers Pro automatically releases the memory buffer using URL.revokeObjectURL so your browser tab stays lightweight even after processing dozens of large documents in a single session. Works flawlessly on desktop, tablet, and mobile browsers.",
    category: "organize",
    icon: "Combine",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 1,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Separate one PDF into multiple smaller files by page range or interval.",
    description:
      "Split PDF lets you break down a large, multi-page PDF document into smaller, individually downloadable files based on custom page ranges, fixed intervals, or a single page per file. All extraction logic runs locally through pdf-lib's efficient page-copying engine, meaning your document's structure, images, and text layers remain fully intact in every output file. This is incredibly useful when you need to isolate a single chapter from an eBook, separate individual invoices that were scanned together, extract exam answer sheets for individual grading, or prepare specific sections of a legal contract for different stakeholders. The interface displays a live thumbnail preview of every page so you can visually select exactly where each split should occur before processing. Multiple output files are automatically packaged into a convenient ZIP archive using JSZip for one-click downloading, saving you from manually downloading dozens of separate files. Since no PDF content is ever transmitted to a backend server, confidential documents such as medical records, financial statements, or internal company reports remain completely private throughout the entire splitting process. The tool handles documents with hundreds of pages smoothly thanks to optimized in-memory buffer management, and all temporary object URLs are automatically revoked after download completes to prevent browser memory bloat during extended usage sessions.",
    category: "organize",
    icon: "Scissors",
    keywords: ["split pdf", "separate pdf pages", "extract pdf pages free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf / .zip",
    priority: 1,
  },
  {
    slug: "remove-pages",
    name: "Remove Pages",
    shortDescription: "Delete unwanted or blank pages from any PDF document instantly.",
    description:
      "Remove Pages gives you precise, visual control over deleting unnecessary, duplicate, or blank pages from any PDF file without needing specialized desktop software. The tool renders a thumbnail gallery of your entire document using pdfjs-dist so you can click to select exactly which pages should be discarded, then pdf-lib rebuilds a clean, renumbered document containing only the pages you chose to keep. This is ideal for removing cover pages before printing, deleting a scanned blank sheet that accidentally got included in a batch scan, stripping out confidential cover letters before sharing a report externally, or trimming down bulky training manuals to only the relevant sections. Because the entire removal operation happens inside your browser's sandboxed memory using WebAssembly, there is no upload delay, no server queue, and absolutely zero risk of your document being stored, logged, or accessed by a third party. Large documents with hundreds of pages are handled efficiently through optimized page-index filtering rather than full re-rendering, keeping the operation fast even on modest hardware. Once your cleaned-up PDF is ready, it downloads immediately as a standard, universally compatible PDF file, and the associated memory buffers are automatically garbage collected to keep your browser tab responsive for your next task.",
    category: "organize",
    icon: "FileMinus",
    keywords: ["remove pdf pages", "delete pdf page", "pdf page remover"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "extract-pages",
    name: "Extract Pages",
    shortDescription: "Pull out specific pages from a PDF to create a brand new standalone file.",
    description:
      "Extract Pages is the inverse of page removal — instead of deleting pages, it lets you select exactly which pages to keep and compiles them into a brand new, self-contained PDF document. Using an interactive visual thumbnail grid powered by pdfjs-dist, you can click individual pages, use range syntax like 1-5,8,11-13, or select every even or odd page with one click. The pdf-lib engine then copies only the chosen pages at the object level, preserving original resolution, embedded fonts, hyperlinks, and vector graphics without any quality degradation. This tool is extremely popular among students extracting a single chapter for revision, lawyers pulling specific clauses from lengthy contracts, accountants isolating one month's transactions from a yearly statement, and HR professionals separating individual employee records from a combined personnel file. Everything happens locally in your browser's RAM, meaning there is no upload wait time and your extracted content — however sensitive — never touches an external server or database. The tool is optimized to handle documents containing hundreds of pages without lag, and it automatically cleans up temporary blob URLs with URL.revokeObjectURL immediately after your new file downloads, ensuring your browser remains fast and memory-efficient even during repeated extraction tasks throughout your workflow.",
    category: "organize",
    icon: "FilePlus2",
    keywords: ["extract pdf pages", "pull pages from pdf", "pdf page extractor"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    shortDescription: "Drag and drop to reorder, rotate, and arrange PDF pages visually.",
    description:
      "Organize PDF provides a complete visual page-management workspace where you can drag and drop thumbnails to reorder your document, rotate individual pages, duplicate pages, and delete unwanted sheets, all within a single intuitive interface before saving your final arrangement. Behind the scenes, pdfjs-dist renders a fast, lightweight thumbnail preview of every page, while pdf-lib performs the actual low-level page copying and rotation once you confirm your layout, ensuring the final output preserves full document fidelity including fonts, images, and vector elements. This tool is invaluable for consolidating scanned documents that were captured out of order, rearranging a presentation deck exported to PDF, fixing sideways-scanned pages from a mobile scanner app, or assembling a custom report by pulling together pages in a logical narrative sequence. Everything is processed entirely client-side using WebAssembly, meaning sensitive internal reports, academic theses, or legal filings never leave your device during the reorganization process — there are no uploads, no cloud storage, and no server-side logging whatsoever. The drag-and-drop interface works smoothly on both desktop and touch-enabled tablets. Once you click Save, the newly organized PDF is generated instantly and downloaded, with all temporary rendering buffers and object URLs automatically revoked to keep your browser session clean and performant.",
    category: "organize",
    icon: "LayoutGrid",
    keywords: ["organize pdf pages", "reorder pdf", "rearrange pdf pages"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortDescription: "Fix sideways or upside-down pages by rotating them 90, 180, or 270 degrees.",
    description:
      "Rotate PDF instantly corrects pages that were scanned sideways, upside down, or at an incorrect orientation by applying precise 90, 180, or 270-degree rotations to either the entire document or individually selected pages. The tool uses pdf-lib's native rotation API to adjust the page's rotation metadata directly, which means the operation is lossless, near-instantaneous, and does not require re-rendering or recompressing any images or text within the document. A live thumbnail preview lets you see exactly how each page will look before committing to the rotation, and you can mix different rotation angles across different pages within the same batch operation — useful for mixed-orientation scans from double-sided scanning hardware. Common use cases include fixing mobile-scanned receipts and ID documents, correcting landscape pages that were accidentally scanned in portrait mode, and preparing print-ready documents with consistent page orientation throughout. Since the entire rotation process runs locally inside your browser using WebAssembly, no document content is ever uploaded to a remote server, keeping personal identification documents and confidential business files completely private. The tool handles documents of any length smoothly, and after your corrected PDF downloads, all temporary object URLs and memory buffers are automatically released via URL.revokeObjectURL to prevent unnecessary memory accumulation during your session.",
    category: "organize",
    icon: "RotateCw",
    keywords: ["rotate pdf", "fix pdf orientation", "rotate pdf pages free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortDescription: "Shrink large PDF file sizes while preserving readable quality.",
    description:
      "Compress PDF reduces the file size of bulky PDF documents by re-optimizing internal object structures, stripping redundant metadata, and applying object stream compression entirely within your browser using pdf-lib's optimized save engine. This is essential for emailing documents that exceed attachment size limits, uploading resumes to job portals with strict file-size caps, speeding up website load times when embedding PDFs, or simply saving storage space across large document archives. Unlike many online compressors that silently degrade image quality or destroy embedded fonts, PDF Lovers Pro's compression engine intelligently restructures the PDF's internal cross-reference tables and object streams to minimize overhead while keeping your text sharp and images recognizable. You can choose between standard compression for everyday use and maximum compression for documents where file size is the top priority over marginal quality loss. The entire operation — reading, rebuilding, and re-saving the PDF — happens using WebAssembly directly in your device's RAM, meaning large confidential contracts, medical scans, or architectural drawings never pass through an external server during compression. There are no file size upload limits imposed by server infrastructure, and processing speed depends only on your own device's performance. Once compression finishes, the smaller file downloads immediately and all temporary memory allocations are cleaned up automatically to keep your browser tab lightweight.",
    category: "optimize",
    icon: "FileArchive",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf file free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 1,
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    shortDescription: "Fix corrupted, damaged, or unreadable PDF files and restore access.",
    description:
      "Repair PDF attempts to recover and rebuild damaged or corrupted PDF files that fail to open properly in standard viewers due to malformed cross-reference tables, truncated byte streams, or broken object dictionaries. The tool loads your file using a lenient parsing mode in pdf-lib and pdfjs-dist that tolerates minor structural inconsistencies, then reconstructs a clean, standards-compliant PDF by re-mapping valid page objects, fonts, and image resources into a freshly generated document structure. This is particularly helpful for files that became corrupted during an interrupted download, PDFs exported incorrectly from older software, documents damaged during email transmission, or files that trigger 'failed to load PDF document' errors in browsers like Chrome or Adobe Reader. While not every corruption scenario can be fully resolved client-side, the majority of common structural issues — such as missing trailers, broken page trees, or invalid xref offsets — can be successfully repaired using this recovery engine. Since the repair process runs entirely within your browser's WebAssembly sandbox, you never need to upload a potentially sensitive or broken file to an unknown third-party server just to attempt a fix. The repaired output is validated by successfully re-parsing it before the download is offered, giving you confidence that the resulting file will open correctly, and all temporary buffers are cleared from memory immediately afterward.",
    category: "optimize",
    icon: "Wrench",
    keywords: ["repair pdf", "fix corrupted pdf", "recover damaged pdf file"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.8,
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortDescription: "Convert JPG, PNG, or WebP images into a single downloadable PDF file.",
    description:
      "JPG to PDF transforms one or multiple image files into a professionally formatted PDF document, automatically sizing each page to match the embedded image's natural dimensions for a distortion-free result. Built on pdf-lib's native image embedding functions, this tool supports JPG, JPEG, PNG, and WebP formats, decoding each image directly in your browser's memory and placing it onto its own dedicated PDF page without any quality loss or recompression artifacts. You can upload dozens of images at once and use the drag-and-drop reordering panel to arrange them in the exact sequence you want before generating your combined PDF — perfect for turning a stack of scanned receipts into one expense report, compiling photographed whiteboard notes into a study document, converting a photographed contract into a shareable PDF, or building a simple photo portfolio. Because every byte of image data is processed locally through WebAssembly, your photographs — which may contain sensitive personal information, business data, or proprietary designs — are never transmitted to any external server or stored in any database. The tool automatically handles orientation metadata (EXIF) correction so images appear right-side-up in the final document. Once conversion completes, the resulting PDF downloads instantly, and all image buffers and temporary object URLs are released immediately to keep your browser session fast and memory-efficient.",
    category: "convert-to-pdf",
    icon: "ImagePlus",
    keywords: ["jpg to pdf", "image to pdf converter", "png to pdf free"],
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: ".pdf",
    priority: 1,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    shortDescription: "Convert DOCX Word documents into professional, print-ready PDF files.",
    description:
      "Word to PDF converts Microsoft Word .docx documents into clean, universally viewable PDF files directly within your browser, eliminating the need to open Microsoft Word or rely on a remote conversion server. The tool parses your document's XML structure using the mammoth.js library to extract formatted text, headings, lists, tables, and embedded images, then reconstructs the layout as crisp vector-based content inside a new PDF generated by pdf-lib. This is extremely useful for job seekers who need to submit a resume in PDF format, students submitting assignments that require a non-editable file type, freelancers sending finalized proposals to clients, or businesses archiving contracts in a format that won't accidentally be modified. Because the entire conversion pipeline — document parsing, text extraction, and PDF generation — runs locally through WebAssembly and pure JavaScript, your Word document's content, which may include personal data, financial figures, or proprietary business information, never leaves your device or touches a third-party conversion server. While extremely complex layouts with advanced macros or unusual custom styling may render with minor formatting differences compared to Microsoft Word's native PDF export, the vast majority of standard business and academic documents convert cleanly with accurate pagination. The final PDF downloads immediately, and all parsed document data is cleared from memory after processing completes.",
    category: "convert-to-pdf",
    icon: "FileType2",
    keywords: ["word to pdf", "docx to pdf converter free", "convert word document to pdf"],
    acceptedFormats: [".docx"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    shortDescription: "Turn Excel spreadsheets into neatly formatted, shareable PDF reports.",
    description:
      "Excel to PDF converts .xlsx and .xls spreadsheet files into clean, tabular PDF documents that preserve column structure, cell values, and sheet organization, making your data easy to print, archive, or share with people who don't have spreadsheet software installed. The conversion engine uses the xlsx library to parse workbook data directly in your browser, reading every sheet, row, and cell value, then uses pdf-lib to render that data into professionally formatted tables with automatic column width adjustment and page-break handling for larger datasets. This tool is ideal for accountants exporting monthly financial statements for client review, project managers sharing budget trackers with stakeholders who prefer a fixed, non-editable format, teachers converting gradebooks into printable reports, or small business owners generating invoices and inventory reports from their spreadsheet templates. Multi-sheet workbooks are automatically converted into separate, clearly labeled PDF sections or pages, keeping your data organized exactly as it was structured in the original file. Since your spreadsheet — which often contains sensitive financial figures, customer data, or internal business metrics — is parsed entirely within your browser's local memory using WebAssembly, nothing is ever uploaded to a server or stored anywhere. Once the PDF is generated, it downloads instantly, and temporary workbook data is purged from memory to maintain optimal browser performance.",
    category: "convert-to-pdf",
    icon: "Sheet",
    keywords: ["excel to pdf", "xlsx to pdf converter", "convert spreadsheet to pdf"],
    acceptedFormats: [".xlsx", ".xls"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    shortDescription: "Convert PPTX presentation slides into a polished, shareable PDF deck.",
    description:
      "PowerPoint to PDF converts .pptx presentation files into a clean, slide-by-slide PDF document that preserves your layout, text content, and visual hierarchy so your presentation can be viewed, printed, or shared without requiring PowerPoint or any specialized viewer software. The tool parses the underlying PPTX XML structure directly in your browser to extract slide text frames, titles, bullet points, and embedded images, then reconstructs each slide as an individual page within a newly generated PDF using pdf-lib's precise layout and positioning capabilities. This is especially useful for students submitting presentation assignments through portals that only accept PDF uploads, business professionals distributing pitch decks to clients who may not have PowerPoint installed, conference speakers archiving their talks in a universally accessible format, and teams collaborating across different operating systems where PowerPoint compatibility can vary. Because the entire extraction and rendering pipeline operates locally through JavaScript and WebAssembly, your presentation content — which may include confidential business strategies, unreleased product details, or proprietary research — is never uploaded to an external conversion server or stored in any remote database. Complex animations and video embeds are represented as static final-state slides, since PDF is inherently a static format, but all core visual and textual content is faithfully preserved. The resulting PDF downloads immediately with all memory buffers released afterward.",
    category: "convert-to-pdf",
    icon: "Presentation",
    keywords: ["powerpoint to pdf", "pptx to pdf converter", "convert ppt to pdf free"],
    acceptedFormats: [".pptx"],
    outputFormat: ".pdf",
    priority: 0.8,
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    shortDescription: "Convert web pages or HTML code into downloadable, print-ready PDF files.",
    description:
      "HTML to PDF transforms raw HTML markup or a live webpage URL into a well-formatted PDF document, rendering the content using your browser's own native rendering engine before capturing it as a vector-accurate PDF through the browser's print-to-PDF canvas pipeline combined with pdf-lib for final document assembly. This tool is incredibly useful for developers who need to generate PDF invoices or reports from dynamically generated HTML templates, bloggers archiving articles for offline reading, researchers saving web-based reference material in a stable format, and businesses converting HTML email templates or landing pages into shareable PDF proposals. You can either paste raw HTML code directly into the built-in editor or provide a publicly accessible URL, and the tool will faithfully reproduce fonts, colors, images, and layout structure in the final output, respecting standard CSS styling including flexbox and grid layouts where supported by the rendering engine. Because rendering happens locally within your own browser sandbox rather than on a remote headless-browser server, there's no risk of your HTML content, internal company templates, or draft web pages being logged, cached, or inspected by a third party. Page breaks are automatically calculated based on content height to avoid awkwardly split paragraphs or images. Once conversion completes, your PDF downloads instantly and all rendering buffers are cleared from memory.",
    category: "convert-to-pdf",
    icon: "Code2",
    keywords: ["html to pdf", "webpage to pdf converter", "convert html code to pdf"],
    acceptedFormats: [".html", ".htm"],
    outputFormat: ".pdf",
    priority: 0.7,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    shortDescription: "Export every PDF page as a high-resolution JPG or PNG image file.",
    description:
      "PDF to JPG converts each page of your PDF document into a separate, high-resolution image file, giving you individually downloadable JPG or PNG files that are perfect for sharing on social media, embedding into presentations, or using in design software that doesn't support PDF import. The conversion process uses pdfjs-dist to render each page onto an HTML canvas element at a configurable scale factor — up to 4x resolution for crisp, print-quality output — before encoding the canvas data as a standard image file entirely within your browser. This is extremely useful for extracting individual slides or diagrams from a PDF report to use in a blog post, converting scanned photo pages into standalone image files, pulling a single chart or graph out of a research paper for a presentation, or creating image previews of document pages for a content management system. For multi-page documents, all generated images are automatically bundled into a convenient ZIP archive using JSZip, allowing you to download every page's image in a single click rather than one at a time. Since rendering happens entirely within your browser's local canvas environment using WebAssembly-accelerated PDF parsing, your document content never leaves your device during conversion. All canvas elements and object URLs are properly disposed of and revoked immediately after the download completes to prevent memory leaks.",
    category: "convert-from-pdf",
    icon: "FileImage",
    keywords: ["pdf to jpg", "pdf to image converter", "convert pdf to png free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".jpg / .png / .zip",
    priority: 1,
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    shortDescription: "Convert PDF documents into fully editable Microsoft Word DOCX files.",
    description:
      "PDF to Word extracts the text content, paragraph structure, and basic formatting from your PDF document and reconstructs it as an editable .docx file that opens natively in Microsoft Word, Google Docs, or any compatible word processor. Using pdfjs-dist's text content extraction API, the tool analyzes the positional coordinates of every text run on each page to intelligently reconstruct paragraph breaks, approximate font sizing, and reading order, then packages this structured content into a valid Office Open XML document format directly in your browser. This conversion is a lifesaver when you've received a contract, resume, or report as a flattened PDF and need to make edits, update figures in a financial statement, repurpose content from an old document for a new project, or simply extract text for further editing without manually retyping everything. While extremely complex layouts involving multi-column designs, intricate tables, or heavily styled graphics may require minor manual cleanup after conversion, standard single-column text documents — which represent the vast majority of everyday PDFs — convert with excellent accuracy. Since the entire text-extraction and DOCX-generation pipeline runs locally using WebAssembly and JavaScript, your document's content, which could include private contracts or personal information, is never transmitted to an external server. The resulting Word file downloads immediately upon completion.",
    category: "convert-from-pdf",
    icon: "FileEdit",
    keywords: ["pdf to word", "pdf to docx converter", "convert pdf to editable word"],
    acceptedFormats: [".pdf"],
    outputFormat: ".docx",
    priority: 1,
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    shortDescription: "Extract tables and structured data from PDF files into editable Excel sheets.",
    description:
      "PDF to Excel analyzes the tabular structures within your PDF document and converts detected rows and columns into a structured .xlsx spreadsheet file that you can immediately edit, sort, filter, and analyze in Excel, Google Sheets, or any compatible application. The tool uses pdfjs-dist to extract text along with its precise X and Y coordinates on each page, then applies a column-clustering algorithm to group text fragments into logical rows and columns based on their spatial alignment, before writing the reconstructed grid into a workbook using the xlsx library. This is particularly valuable for accountants who received a financial statement as a PDF and need to recalculate totals, researchers extracting data tables from academic papers for further statistical analysis, procurement teams converting vendor price lists into editable spreadsheets, or anyone who needs to digitize tabular data that was only available in document form. Documents with complex merged cells, nested tables, or inconsistent spacing may require some manual adjustment after extraction, but standard invoices, reports, and simple data tables typically convert with strong accuracy. The entire text-position analysis and spreadsheet-generation process runs locally within your browser using WebAssembly, meaning your financial and business data never passes through a third-party server. The resulting Excel file downloads instantly once processing completes.",
    category: "convert-from-pdf",
    icon: "FileSpreadsheet",
    keywords: ["pdf to excel", "pdf to xlsx converter", "extract pdf table to excel"],
    acceptedFormats: [".pdf"],
    outputFormat: ".xlsx",
    priority: 0.9,
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    shortDescription: "Convert PDF pages into fully editable PowerPoint PPTX presentation slides.",
    description:
      "PDF to PowerPoint transforms each page of your PDF document into an individual, editable slide within a new .pptx presentation file, allowing you to further customize text, reposition elements, and present your content using Microsoft PowerPoint, Google Slides, or Keynote. The conversion pipeline uses pdfjs-dist to render each page and extract positioned text elements and embedded images, which are then reconstructed as text boxes and image placeholders on corresponding slides using the pptxgenjs library, preserving the approximate visual layout and reading order of the original document. This tool is especially useful for converting a PDF-exported slide deck back into an editable format after losing the original PowerPoint file, repurposing content from a PDF report into a presentation format for a meeting, turning a PDF infographic into editable presentation slides for further customization, or academic researchers converting a PDF paper's key figures into a conference talk deck. Since full PowerPoint fidelity (such as animations, transitions, or embedded vector shapes) cannot be perfectly reverse-engineered from a flattened PDF, the output focuses on faithfully preserving text content and image placement to give you a strong editable starting point. All processing — rendering, extraction, and slide generation — happens locally in your browser via WebAssembly, ensuring your presentation content remains completely private throughout conversion, with the final file downloading immediately.",
    category: "convert-from-pdf",
    icon: "MonitorPlay",
    keywords: ["pdf to powerpoint", "pdf to pptx converter", "convert pdf to editable slides"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pptx",
    priority: 0.8,
  },
  {
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    shortDescription: "Convert standard PDFs into the ISO-archival PDF/A format for long-term storage.",
    description:
      "PDF to PDF/A converts a regular PDF document into the ISO 19005 standardized PDF/A archival format, which is specifically designed for long-term digital preservation by embedding all fonts, removing dependencies on external resources, and ensuring the document will render identically decades into the future regardless of software changes. The conversion process uses pdf-lib to embed any non-embedded fonts directly into the document, strip out JavaScript and multimedia elements that violate archival standards, set required XMP metadata fields, and adjust the document's color profile to comply with PDF/A-1b or PDF/A-2b conformance levels. This tool is essential for government agencies, legal firms, libraries, and corporations that are legally or institutionally required to archive documents in a format guaranteed to remain accessible and unaltered for many years, as well as for businesses submitting documents to regulatory bodies, courts, or institutional repositories that mandate PDF/A compliance for official record-keeping. Since many standard PDFs rely on system fonts or external resources that could become unavailable over time, this conversion process future-proofs your important records against software obsolescence. All embedding, metadata adjustment, and format restructuring happens entirely within your browser's local memory using WebAssembly, meaning sensitive legal or governmental documents are never exposed to an external server during the archival conversion process.",
    category: "convert-from-pdf",
    icon: "Archive",
    keywords: ["pdf to pdfa", "pdf archival format converter", "iso 19005 pdf converter"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.6,
  },
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    shortDescription: "Add text, images, shapes, and annotations directly onto any PDF page.",
    description:
      "Edit PDF gives you a full in-browser editing canvas where you can click anywhere on a page to add new text boxes, insert images or company logos, draw basic shapes like rectangles and lines, and freely reposition each element before saving your changes permanently into the document structure. Built on pdfjs-dist for accurate page rendering and pdf-lib for writing new content layers directly onto the existing PDF, this tool lets you fill in blank spaces on forms, add a missing signature line, insert a company stamp, annotate a diagram with explanatory text, or correct a typo without needing to recreate the entire document from scratch. Every text element you add supports customizable font size, color, and basic formatting, while inserted images can be freely resized and repositioned using intuitive drag handles. This is particularly valuable for freelancers customizing contract templates, teachers adding comments directly onto a student's submitted PDF assignment, small business owners adding their logo to standardized documents, or anyone needing to make quick manual edits to an otherwise finalized PDF. Because all rendering and editing operations occur locally within your browser's canvas and memory using WebAssembly, your document's content is never uploaded to a remote editing server, keeping sensitive contracts and personal documents completely private. The edited file downloads instantly once you save your changes.",
    category: "edit",
    icon: "Edit3",
    keywords: ["edit pdf online", "add text to pdf", "pdf editor free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 1,
  },
  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    shortDescription: "Automatically insert sequential page numbers into your PDF document.",
    description:
      "Add Page Numbers automatically inserts sequential numbering onto every page of your PDF document, with full control over the starting number, position (bottom-center, bottom-right, top-left, and more), font size, and numbering format such as plain numbers, 'Page X of Y', or Roman numerals. Using pdf-lib's precise text-drawing API combined with the StandardFonts embedding system, the tool calculates exact pixel coordinates on each page based on your selected position preference and draws crisp, vector-based numbering text that remains sharp at any zoom level or print resolution. This feature is essential for preparing academic theses and dissertations that require specific pagination formats, formatting legal briefs and contracts for court submission where page references are critical, organizing lengthy business reports or employee handbooks for easy navigation, and creating professional-looking printed booklets or manuals. You can preview exactly how the numbering will appear before committing to the final document, and the tool intelligently avoids overlapping with existing page content near the edges. Since the entire numbering operation runs locally through WebAssembly without any server round-trip, your confidential internal documents and legal filings remain completely private throughout the process. The numbered PDF downloads immediately after processing, and all temporary rendering resources are cleared from browser memory right away.",
    category: "edit",
    icon: "Hash",
    keywords: ["add page numbers to pdf", "pdf pagination tool", "number pdf pages online"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.8,
  },
  {
    slug: "add-watermark",
    name: "Add Watermark",
    shortDescription: "Stamp custom text or logo watermarks across every page of your PDF.",
    description:
      "Add Watermark overlays custom text or an uploaded logo image diagonally or horizontally across every page of your PDF document, with adjustable opacity, font size, color, and rotation angle to clearly mark documents as 'Confidential', 'Draft', 'Copy', or to brand them with your company name and logo. The tool leverages pdf-lib's text and image drawing capabilities to embed the watermark directly into each page's content stream, ensuring it becomes a permanent, non-removable part of the document rather than a simple overlay that could be stripped away. This feature is critical for protecting intellectual property before sharing draft contracts with external parties, marking sensitive internal reports to prevent unauthorized distribution, branding client deliverables with your company logo for professional presentation, and clearly labeling preliminary documents to avoid confusion with finalized versions. You can control watermark placement precisely, choose semi-transparent styling so underlying text remains readable, and apply the watermark to all pages or only a specific selected range. Because the entire watermarking process happens locally within your browser using WebAssembly, there's no risk of your proprietary branding assets or confidential document content being transmitted to or stored on an external server. The finished, watermarked PDF downloads instantly, and all temporary image and font buffers used during the process are released from memory immediately afterward.",
    category: "edit",
    icon: "Stamp",
    keywords: ["add watermark to pdf", "pdf watermark tool free", "stamp pdf with logo"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    shortDescription: "Trim unwanted margins or whitespace from PDF pages with visual precision.",
    description:
      "Crop PDF lets you visually trim excess margins, whitespace, or unwanted borders from every page of your document using a draggable selection rectangle overlaid on a live thumbnail preview rendered by pdfjs-dist. Once you've defined your desired crop boundaries, pdf-lib applies the new crop box dimensions directly to the underlying PDF page objects, which instructs every PDF viewer and printer to display only the selected content area while keeping the original full-resolution data intact beneath the surface. This is incredibly useful for removing scanner-induced black borders from digitized documents, trimming wide margins from academic papers to create more compact printable versions, cropping out letterhead or header sections from recurring correspondence before combining it with other content, and standardizing inconsistent page sizes across a batch of scanned forms into one uniform dimension. You can apply the same crop boundaries uniformly across all pages for consistency, or customize crop settings individually for documents with varying page layouts. Since the cropping operation only adjusts the page's visible boundary metadata rather than destructively re-rendering content, the process is extremely fast and preserves perfect text and image sharpness. All processing occurs locally within your browser through WebAssembly, meaning your document never leaves your device, and the cropped PDF downloads immediately with temporary memory buffers cleared right afterward.",
    category: "edit",
    icon: "Crop",
    keywords: ["crop pdf pages", "trim pdf margins", "pdf cropping tool free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.7,
  },
  {
    slug: "annotate-pdf",
    name: "Annotate PDF",
    shortDescription: "Highlight text, draw freehand, and add sticky notes to any PDF document.",
    description:
      "Annotate PDF turns any static document into an interactive review canvas where you can highlight important passages in customizable colors, draw freehand with a pen tool for diagrams or signatures, insert sticky-note style comments at specific locations, and underline or strike through text, all rendered directly onto the page using an HTML canvas overlay synchronized with pdfjs-dist's accurate page rendering. Once you finish annotating, every markup element is permanently baked into the PDF's content stream using pdf-lib, ensuring your highlights and comments remain visible in any standard PDF viewer rather than relying on proprietary annotation layers that might not display correctly elsewhere. This tool is perfect for teachers providing detailed feedback on student submissions, lawyers marking up contract drafts during review cycles, researchers highlighting key findings while reading academic papers, and teams collaborating on document revisions where visual markup communicates changes more clearly than written notes alone. The pen tool supports adjustable stroke width and color for freehand drawing, while the highlighter tool intelligently snaps to text lines for clean, professional-looking emphasis. Because all annotation rendering and the final content-stream embedding happen entirely within your browser using WebAssembly, your reviewed document — which may contain confidential feedback or proprietary research — never leaves your device, and the finished annotated PDF downloads instantly once you're satisfied with your markup.",
    category: "edit",
    icon: "Highlighter",
    keywords: ["annotate pdf online", "highlight pdf text", "pdf markup tool free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.8,
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    shortDescription: "Encrypt your PDF with a password to prevent unauthorized access.",
    description:
      "Protect PDF secures your document by adding password-based access control, ensuring that only people with the correct passphrase can open and view your file's contents, which is critical for safeguarding financial statements, legal contracts, personal identification documents, and any file containing sensitive information before sharing it via email or cloud storage. The tool processes your document entirely within your browser's WebAssembly environment, applying standard PDF encryption algorithms to the document's object streams so that the resulting file requires authentication in every major PDF reader including Adobe Acrobat, Chrome's built-in viewer, and mobile PDF apps. You can set a strong, unique password with a built-in strength indicator to guide you toward a secure passphrase, and optionally configure additional permission restrictions such as disabling printing or copying text from the protected document for an added layer of control. This feature is widely used by HR departments distributing confidential salary information, healthcare providers sharing patient records in compliance with privacy regulations, freelancers sending invoices containing banking details, and businesses protecting proprietary internal documents from unauthorized internal or external access. Since the encryption process happens locally rather than on a remote server, your password and unprotected document content are never transmitted anywhere, eliminating any risk of interception. The password-protected PDF downloads immediately, and all sensitive data buffers are cleared from memory right after.",
    category: "security",
    icon: "Lock",
    keywords: ["password protect pdf", "encrypt pdf online", "add password to pdf free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    shortDescription: "Remove password protection from a PDF you have legal access rights to.",
    description:
      "Unlock PDF removes existing password restrictions and permission locks from a PDF document, provided you already know the correct password or have legitimate authorized access to the file, allowing you to freely edit, print, copy text from, or redistribute a previously protected document without repeatedly entering credentials. The tool uses pdf-lib's decryption capabilities to validate your provided password against the document's encryption dictionary, and upon successful authentication, re-saves the file as a standard, unencrypted PDF with all restrictions lifted. This is especially useful when you've forgotten which password-protected file is which among several similar documents but still remember the password, when a company-wide document was protected during distribution but no longer needs restrictions for internal archival purposes, or when you need to merge a password-protected file with other unprotected documents using tools that require unencrypted input. PDF Lovers Pro strictly requires you to confirm that you have legal authorization to remove protection from the file, and this tool is designed exclusively for legitimate use cases such as managing your own documents or those you've been explicitly authorized to modify. All password validation and decryption processing happens entirely within your browser using WebAssembly, meaning your password is never transmitted to or stored on any external server. The unlocked PDF downloads immediately once decryption succeeds.",
    category: "security",
    icon: "Unlock",
    keywords: ["unlock pdf password", "remove pdf password free", "decrypt pdf online"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.8,
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    shortDescription: "Add a handwritten, typed, or uploaded signature directly onto any PDF.",
    description:
      "Sign PDF allows you to add your personal signature to any document through three flexible methods: drawing a freehand signature using your mouse, finger, or stylus on an interactive canvas pad, typing your name and selecting from several elegant cursive-style fonts, or uploading a previously scanned image of your physical signature. Once created, your signature can be freely resized, repositioned, and placed on any page using a simple drag interface, after which pdf-lib permanently embeds it into the document's content stream as a flattened visual element that will display identically across every PDF viewer and printer. This tool eliminates the tedious process of printing a document, physically signing it, and scanning it back in, making it perfect for signing rental agreements, approving business contracts, submitting signed consent forms for medical or educational purposes, and finalizing freelance service agreements remotely. You can save your signature style locally in your browser for quick reuse across multiple documents within the same session without needing to redraw it each time. Since the entire signature creation and embedding process happens locally through WebAssembly-powered rendering, your signature — a uniquely identifying piece of personal data — is never uploaded to or stored on any external server, giving you complete control and privacy. The signed PDF downloads instantly once you confirm placement.",
    category: "security",
    icon: "PenLine",
    keywords: ["sign pdf online", "electronic signature pdf free", "add signature to pdf"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 1,
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    shortDescription: "Permanently black out sensitive text or data before sharing a PDF.",
    description:
      "Redact PDF permanently removes sensitive information from your document by letting you draw black boxes over confidential text, numbers, or images, after which the underlying content beneath each redaction area is completely destroyed and rebuilt as a flattened image region rather than simply covered with a removable overlay — preventing anyone from copying, selecting, or revealing the hidden text underneath. The tool renders each page through pdfjs-dist so you can visually identify and mark areas containing social security numbers, bank account details, personal addresses, salary figures, or any other confidential information, and then pdf-lib rebuilds the final page by rasterizing the redacted regions into permanent black blocks baked directly into the page's content stream. This is critically important for organizations responding to public records requests, law firms preparing documents for discovery while protecting privileged information, HR departments sharing employee files with limited visibility requirements, and healthcare providers complying with patient privacy regulations before releasing records to third parties. Unlike simple black rectangle overlays added by basic PDF editors — which can often be removed or seen through by tech-savvy users — true redaction permanently eliminates the underlying data at the object level. Since this security-critical operation runs entirely within your browser's local memory using WebAssembly, your unredacted sensitive content never risks exposure through a third-party server, and the redacted PDF downloads immediately upon completion.",
    category: "security",
    icon: "EyeOff",
    keywords: ["redact pdf", "black out pdf text", "remove sensitive data from pdf"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.7,
  },
  {
    slug: "flatten-pdf",
    name: "Flatten PDF",
    shortDescription: "Convert fillable form fields and annotations into permanent static content.",
    description:
      "Flatten PDF converts interactive form fields, annotations, and signature layers into permanent, non-editable static content embedded directly within the page itself, ensuring that filled-in form data, comments, and markups cannot be accidentally altered, deleted, or tampered with after the document has been finalized. Using pdf-lib's form-flattening API, the tool reads every AcroForm field's current value — text inputs, checkboxes, radio buttons, and dropdown selections — and draws that content as fixed text and graphics onto the page before removing the underlying interactive form structure entirely. This process is essential for finalizing completed application forms before official submission, locking in filled government or tax forms to prevent further modification, preserving signed consent forms exactly as they were completed, and ensuring annotated review comments become a permanent part of a document's official record rather than remaining in an editable, potentially disputable state. Flattening also improves compatibility across different PDF viewers, since some interactive form elements render inconsistently between Adobe Acrobat, browser-based viewers, and mobile apps, while flattened static content displays identically everywhere. The entire flattening operation — reading form values and rebuilding static page content — happens completely within your browser's local WebAssembly environment, meaning sensitive completed form data never passes through an external server. The flattened PDF downloads immediately once processing finishes.",
    category: "security",
    icon: "Layers",
    keywords: ["flatten pdf form", "make pdf form uneditable", "flatten pdf annotations"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.6,
  },
  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    shortDescription: "Extract selectable, searchable text from scanned PDF documents using AI.",
    description:
      "OCR PDF uses advanced optical character recognition powered by the Tesseract.js WebAssembly engine to analyze scanned PDF pages — which are essentially just images with no underlying text layer — and accurately identify and extract readable text characters, which are then embedded back into the document as an invisible, selectable, and searchable text layer positioned precisely over the original scanned image. This transforms static scanned documents like old contracts, printed books, faxed forms, or photographed whiteboard notes into fully searchable PDFs where you can use Ctrl+F to find specific words, copy and paste text into other applications, and even run text-to-speech accessibility tools over the content. The recognition engine supports multiple languages and achieves high accuracy on clearly printed text, typewritten documents, and most standard fonts, though handwritten or heavily stylized text may produce lower accuracy results. This tool is invaluable for digitizing physical archives in libraries and legal offices, making historical scanned documents searchable for research purposes, converting photographed receipts into text-extractable records for expense tracking, and improving accessibility for visually impaired users relying on screen readers. Remarkably, the entire OCR analysis runs locally in your browser using WebAssembly-compiled machine learning models — no image data is ever uploaded to a cloud OCR API — keeping your scanned documents completely private throughout the recognition process, with the searchable PDF downloading immediately upon completion.",
    category: "ai-ocr",
    icon: "ScanText",
    keywords: ["ocr pdf online", "extract text from scanned pdf", "make pdf searchable free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.9,
  },
  {
    slug: "scan-to-pdf",
    name: "Scan to PDF",
    shortDescription: "Use your phone or webcam camera to scan physical documents into a PDF.",
    description:
      "Scan to PDF turns your device's camera — whether a laptop webcam or a smartphone camera accessed through your mobile browser — into a portable document scanner, letting you capture photos of physical papers, receipts, ID cards, or handwritten notes and instantly compile them into a clean, properly oriented PDF file without needing a dedicated scanning app installed. After capturing each page through the browser's native camera API, the tool applies automatic edge detection and perspective correction algorithms to crop out background clutter and straighten skewed angles, then enhances contrast and brightness to produce a clean, legible, scanner-like appearance before embedding each processed image as a page within a new PDF using pdf-lib. You can capture multiple pages in sequence, review and retake any shot that didn't come out clearly, reorder captured pages before finalizing, and even apply a grayscale filter for a more traditional document-scan appearance that also reduces file size. This tool is perfect for quickly digitizing paper receipts for expense reports while traveling, capturing a signed contract page when you don't have access to a physical scanner, creating a digital copy of important identification documents for safekeeping, or compiling handwritten meeting notes into a shareable format. Since image capture and processing both happen locally within your browser using WebAssembly, your camera feed and captured images are never transmitted anywhere, and your finished scanned PDF downloads immediately.",
    category: "ai-ocr",
    icon: "Camera",
    keywords: ["scan to pdf", "camera scanner online", "scan document to pdf free"],
    acceptedFormats: [".jpg", ".png", "camera"],
    outputFormat: ".pdf",
    priority: 0.8,
  },
  {
    slug: "compare-pdf",
    name: "Compare PDF",
    shortDescription: "Visually highlight differences between two versions of a PDF document.",
    description:
      "Compare PDF analyzes two versions of a document side by side and visually highlights every textual difference — additions, deletions, and modifications — allowing you to quickly identify exactly what changed between drafts without manually reading through every line of both documents. The tool extracts text content from both PDFs using pdfjs-dist's text content API, aligns corresponding sections using a diffing algorithm similar to those used in software version control systems, and then renders a clear side-by-side or unified view with additions highlighted in green and deletions highlighted in red directly overlaid on rendered page thumbnails. This is enormously valuable for legal professionals reviewing contract revisions to spot clause changes negotiated between parties, editors comparing manuscript drafts to track content edits, students checking different versions of lecture notes or study guides for added content, and business teams verifying that a finalized document matches an originally approved draft before signing or distribution. The comparison engine intelligently ignores minor formatting noise like whitespace differences while focusing on substantive textual changes that actually matter to the reader. Because both documents are parsed, analyzed, and compared entirely within your browser's local memory using WebAssembly, neither version of your potentially confidential contract or sensitive document is ever uploaded to an external comparison server, and the generated difference report can be downloaded as a summary PDF.",
    category: "advanced",
    icon: "GitCompare",
    keywords: ["compare pdf files", "pdf diff tool", "find differences between pdf documents"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.6,
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    shortDescription: "Extract raw, plain text content from any PDF document instantly.",
    description:
      "PDF to Text strips away all formatting, images, and layout structure from your PDF document to extract pure, plain text content that can be easily copied, searched, analyzed, or imported into any text editor, note-taking app, or data processing pipeline. Using pdfjs-dist's text content extraction engine, the tool reads through every page of your document, identifies individual text runs and their reading order, and concatenates them into a clean .txt file while intelligently preserving paragraph breaks and spacing for readability. This is extremely useful for writers who need to extract quotes or source material from a PDF research paper for citation purposes, developers building text-processing pipelines that require raw textual input rather than binary PDF data, students copying lecture content into their own study notes, and accessibility tools that require plain text for screen readers or braille displays. Because the extraction process focuses purely on textual content, it works exceptionally fast even on large multi-hundred-page documents, since no image rendering or complex layout reconstruction is required. The tool also provides a live preview of the extracted text directly in your browser before you download it, allowing you to quickly verify accuracy. All text parsing happens entirely client-side through WebAssembly-accelerated PDF parsing, meaning your document content is never transmitted to an external server, and the resulting plain text file downloads instantly.",
    category: "advanced",
    icon: "FileText",
    keywords: ["pdf to text converter", "extract text from pdf free", "pdf to txt online"],
    acceptedFormats: [".pdf"],
    outputFormat: ".txt",
    priority: 0.7,
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    shortDescription: "Convert plain text or Markdown content into a formatted PDF document.",
    description:
      "Text to PDF converts plain text files or content typed directly into our built-in editor into a cleanly formatted, properly paginated PDF document, complete with configurable font size, page margins, and automatic text wrapping to ensure readability across every page. Using pdf-lib's text-drawing and font-embedding capabilities, the tool calculates precise line breaks and page boundaries based on your selected font and page size, ensuring no text is cut off awkwardly at page edges, and automatically creates new pages as needed for longer documents. You can paste in anything from simple notes to lengthy manuscripts, select from several embedded standard fonts, and even apply basic Markdown-style formatting such as headers and bullet points that get translated into appropriately styled PDF text elements. This tool is ideal for quickly turning a plain text file exported from a note-taking app into a shareable, professional-looking document, converting code snippets or configuration files into an archivable PDF format, drafting simple letters or memos without needing a full word processor, and creating simple printable handouts or study guides from raw text content. Since the entire text-layout and PDF-generation process runs locally within your browser using WebAssembly, your written content — which might include personal notes, drafts, or confidential information — is never transmitted anywhere. The finished PDF downloads immediately upon generation.",
    category: "advanced",
    icon: "FileTextIcon",
    keywords: ["text to pdf converter", "convert txt to pdf free", "create pdf from text online"],
    acceptedFormats: [".txt", ".md"],
    outputFormat: ".pdf",
    priority: 0.5,
  },
  {
    slug: "grayscale-pdf",
    name: "Grayscale PDF",
    shortDescription: "Convert colorful PDF pages into black-and-white grayscale for printing.",
    description:
      "Grayscale PDF converts every colored page in your document into black-and-white grayscale tones, which significantly reduces ink or toner consumption when printing and gives your document a clean, professional, document-archive appearance suitable for formal submissions or black-and-white photocopying. The tool renders each page onto an HTML canvas using pdfjs-dist at high resolution, applies a precise luminance-based grayscale conversion algorithm to every pixel to preserve contrast and readability, and then re-embeds each converted page as an optimized image within a newly generated PDF using pdf-lib. This is particularly useful for students and office workers who need to print lengthy color documents on a budget without burning through expensive color ink cartridges, businesses preparing black-and-white copies of colorful marketing materials for internal distribution, legal professionals converting documents for formal black-and-white court filing requirements, and anyone wanting to reduce the visual distraction of color highlighting when focusing purely on text content. The conversion preserves text legibility and image detail through careful contrast adjustment during the grayscale calculation, avoiding the washed-out appearance that simple color-channel averaging can sometimes produce. Because this entire rendering and recoloring pipeline operates locally within your browser using WebAssembly-accelerated canvas processing, your document's visual content never leaves your device, and the converted grayscale PDF downloads immediately once processing completes.",
    category: "advanced",
    icon: "Contrast",
    keywords: ["grayscale pdf converter", "black and white pdf", "convert color pdf to grayscale free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.5,
  },
  {
    slug: "pdf-page-counter",
    name: "PDF Page Counter",
    shortDescription: "Instantly check the exact page count and metadata of any PDF file.",
    description:
      "PDF Page Counter instantly analyzes an uploaded PDF document and displays its exact page count along with useful metadata including document title, author, creation date, modification date, PDF version, and file size, all without needing to open the file in a separate viewer application. The tool uses pdf-lib's lightweight document-parsing API to read the document's internal structure and extract this information directly within your browser in a matter of milliseconds, even for very large documents, since only the header and object directory need to be parsed rather than rendering every page visually. This is a handy quick-reference tool for freelancers and print shops who need to calculate printing costs based on exact page counts, students verifying that an assignment meets a minimum or maximum page requirement before submission, writers tracking manuscript length across different draft versions, and administrative staff cataloging large batches of documents by their page count and metadata for record-keeping purposes. The results are displayed instantly in a clean summary panel, and you can process multiple files sequentially to quickly audit an entire folder of PDFs without needing to open each one individually. Since this is purely a read-only analysis operation performed entirely within your browser using WebAssembly, your document's content and metadata are never transmitted to any external server, making it a fast, safe, and completely private way to inspect PDF files.",
    category: "advanced",
    icon: "Hash",
    keywords: ["pdf page counter", "check pdf page count online", "pdf metadata viewer free"],
    acceptedFormats: [".pdf"],
    outputFormat: "report",
    priority: 0.4,
  },
  {
    slug: "resize-pdf",
    name: "Resize PDF",
    shortDescription: "Change PDF page dimensions to standard sizes like A4, Letter, or Legal.",
    description:
      "Resize PDF adjusts the physical page dimensions of your document to standard paper sizes such as A4, US Letter, Legal, or custom dimensions you specify, automatically scaling the existing content proportionally to fit the new page size while maintaining aspect ratio and preventing distortion or content cropping. Using pdf-lib's page dimension and content-scaling APIs, the tool calculates the appropriate scale factor needed to fit your original content within the target page size, then applies a transformation matrix to resize all text, images, and vector graphics on each page accordingly, producing a document that prints correctly on your chosen paper format. This is essential when you receive a document formatted for one regional paper standard, such as A4 used throughout Europe and Asia, but need to print it on a printer loaded with US Letter paper common in North America, or when consolidating documents from multiple sources with inconsistent original page sizes into one uniformly formatted file. The tool also supports custom pixel or inch-based dimensions for specialized printing needs such as certificates, labels, or non-standard booklet formats. You can preview the resized layout before finalizing to ensure no important content gets cut off near the new page edges. Since all resizing calculations and content transformations happen locally within your browser using WebAssembly, your document never leaves your device, and the resized PDF downloads immediately upon completion.",
    category: "advanced",
    icon: "Maximize2",
    keywords: ["resize pdf page size", "change pdf to a4", "pdf page size converter free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.5,
  },
  {
    slug: "n-up-pdf",
    name: "N-Up PDF",
    shortDescription: "Combine multiple PDF pages onto a single sheet to save paper when printing.",
    description:
      "N-Up PDF rearranges your document so that multiple original pages — 2, 4, 6, or 9 at a time — are combined and shrunk down onto a single printed sheet, dramatically reducing paper consumption when printing reference materials, drafts, or handouts where individual full-size pages aren't necessary. The tool calculates optimal grid layouts and scaling factors using pdf-lib's page composition APIs, placing miniaturized versions of each original page into a precise grid arrangement on new, larger pages while maintaining consistent spacing and alignment for a clean, professional printed result. This feature is extremely popular among students printing lecture slide decks for study purposes where reading multiple small slides per page is perfectly sufficient, teachers creating compact handout versions of presentation materials for classroom distribution, businesses printing internal review drafts where paper and ink costs matter more than full-size readability, and environmentally conscious users looking to minimize paper waste across all their printing needs. You can choose your preferred grid layout, select the page order (left-to-right or top-to-bottom), and add thin dividing lines between combined pages for visual clarity when printed. Since the entire page composition and scaling calculation process happens locally within your browser using WebAssembly, your document content remains completely private throughout, and the resulting space-saving PDF downloads immediately once the layout has been generated.",
    category: "advanced",
    icon: "Grid3x3",
    keywords: ["n-up pdf printing", "multiple pages per sheet pdf", "pdf booklet layout tool"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.4,
  },
  {
    slug: "pdf-metadata-editor",
    name: "PDF Metadata Editor",
    shortDescription: "View and edit a PDF's title, author, subject, and keyword metadata fields.",
    description:
      "PDF Metadata Editor lets you view and modify the hidden document properties embedded within every PDF file, including the title, author name, subject description, keywords, and creator application fields, which are important for document organization, search engine optimization of hosted PDFs, and professional presentation when documents are shared or archived. Using pdf-lib's metadata read and write APIs, the tool extracts the current values from your document's Info dictionary and displays them in simple editable form fields, allowing you to update inaccurate or missing information before saving the changes back into a new version of the file without altering any actual page content. This is particularly useful for businesses standardizing document properties across a library of company templates and reports for consistent cataloging, authors and publishers ensuring their name and copyright information is properly embedded in distributed PDF documents, website owners optimizing PDF metadata for better search engine indexing when files are publicly hosted, and IT administrators cleaning up inconsistent or leftover metadata from old document templates that may inadvertently reveal internal authoring software or file paths. You can also strip out all metadata entirely for privacy purposes before sharing a document publicly, removing any trace of the original author or creation software. Since metadata reading and writing both happen entirely within your browser using WebAssembly, your document's properties are never exposed to an external server, and the updated file downloads immediately.",
    category: "advanced",
    icon: "Tags",
    keywords: ["pdf metadata editor", "edit pdf properties online", "change pdf author title free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.4,
  },
  {
    slug: "extract-images-pdf",
    name: "Extract Images from PDF",
    shortDescription: "Pull out every embedded image from a PDF document as separate image files.",
    description:
      "Extract Images from PDF scans through your document and identifies every embedded image object — photographs, logos, diagrams, charts, and illustrations — then extracts each one as a separate, individually downloadable image file without any quality loss, since the original compressed image data is pulled directly from the PDF's internal object structure rather than being re-rendered from a screenshot. Using pdfjs-dist's object inspection capabilities combined with pdf-lib's resource parsing, the tool locates every XObject image reference across all pages, decodes the appropriate format (JPEG, PNG, or raw bitmap data), and packages the results into a convenient ZIP archive using JSZip for easy batch downloading. This tool is incredibly useful for graphic designers needing to reuse a logo or illustration that only exists embedded within an old PDF brochure, researchers extracting charts and figures from academic papers for use in their own presentations, archivists digitizing old scanned photo albums that were compiled into a single PDF, and marketers pulling product images out of supplier catalogs distributed in PDF format. The tool automatically filters out tiny decorative elements like bullet points or dividing lines below a configurable size threshold, focusing only on substantial, usable images. Since the entire image detection and extraction process runs locally within your browser using WebAssembly, your document's embedded visual content never leaves your device, and the extracted images download immediately in their original resolution and quality.",
    category: "advanced",
    icon: "Images",
    keywords: ["extract images from pdf", "pdf image extractor free", "download pdf embedded images"],
    acceptedFormats: [".pdf"],
    outputFormat: ".zip",
    priority: 0.6,
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    shortDescription: "Combine a batch of multiple images into one organized, multi-page PDF.",
    description:
      "Images to PDF takes an entire batch of image files — JPG, PNG, or WebP — and combines them into a single, well-organized, multi-page PDF document, with full drag-and-drop control over page ordering and options to standardize page size or preserve each image's original dimensions for a distortion-free result. The tool uses pdf-lib's native image embedding capabilities to decode each image directly in your browser's memory and place it onto its own dedicated page, automatically detecting image format and applying appropriate compression settings to balance file size with visual quality. This is extremely practical for compiling a folder of photographed document pages into one shareable PDF, consolidating dozens of product photography images into a single catalog file for a supplier or client, creating a digital photo album from a vacation or event's camera roll, and bundling scanned handwritten notes or whiteboard photos into one organized study document. You can select cover page options, add simple page margins around each image for a cleaner printed appearance, and reorder your batch at any point before final generation using the intuitive thumbnail grid interface. Since every image is decoded and embedded entirely within your browser's local memory using WebAssembly, your personal photographs and scanned documents are never uploaded to any external server during the conversion process, and your finished multi-page PDF downloads immediately once compilation is complete.",
    category: "advanced",
    icon: "Images",
    keywords: ["images to pdf converter", "combine photos into pdf free", "multiple images to one pdf"],
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormat: ".pdf",
    priority: 0.6,
  },
  {
    slug: "pdf-to-pdfua",
    name: "PDF to PDF/UA",
    shortDescription: "Convert PDFs into the PDF/UA accessible format for screen reader compatibility.",
    description:
      "PDF to PDF/UA restructures your document to comply with the ISO 14289 PDF/UA (Universal Accessibility) standard, which ensures your PDF can be properly navigated and read aloud by screen readers used by visually impaired individuals, making your content legally compliant with accessibility regulations such as the ADA and Section 508 in many jurisdictions. The conversion process uses pdf-lib to add required structural tagging elements that define reading order, heading hierarchy, and semantic roles for different content blocks, embeds descriptive alternative text placeholders for images that require manual captioning, and ensures proper document language declaration and logical tab order for interactive form fields. This tool is essential for government agencies and public institutions legally required to provide accessible digital documents, educational institutions ensuring course materials are usable by students relying on assistive technology, corporations meeting accessibility compliance requirements for public-facing documentation, and publishers wanting to expand their content's reach to the widest possible audience including visually impaired readers. While achieving full PDF/UA compliance for complex documents with intricate tables and multi-column layouts often benefits from additional manual review using specialized accessibility checking software, this tool provides essential automated structural tagging as a strong compliance foundation. All processing occurs locally within your browser using WebAssembly, ensuring your document content remains private throughout the accessibility conversion, with the tagged PDF downloading immediately upon completion.",
    category: "advanced",
    icon: "Accessibility",
    keywords: ["pdf to pdfua converter", "accessible pdf tool", "pdf ada compliance converter"],
    acceptedFormats: [".pdf"],
    outputFormat: ".pdf",
    priority: 0.3,
  },
  {
    slug: "batch-process-pdf",
    name: "Batch Process PDF",
    shortDescription: "Apply merge, compress, or watermark operations to many PDFs at once.",
    description:
      "Batch Process PDF lets you upload dozens of PDF files simultaneously and apply the same operation — compression, watermarking, page numbering, or format conversion — across your entire batch in one streamlined workflow, saving enormous amounts of time compared to processing each file individually through separate tool pages. The tool queues each uploaded document and sequentially runs it through the selected processing pipeline using the same underlying pdf-lib and pdfjs-dist engines that power our individual tools, displaying a real-time progress indicator showing exactly which file is currently being processed and how many remain in the queue. Once all files have been processed, the complete set of output documents is automatically packaged into a single convenient ZIP archive using JSZip, ready for one-click download rather than requiring dozens of individual download confirmations. This feature is a massive time-saver for office administrators who need to compress an entire folder of scanned invoices before archiving, legal assistants adding a confidentiality watermark to every document in a case file simultaneously, HR teams applying consistent page numbering across a large batch of onboarding documents, and freelancers converting an entire portfolio of Word documents to PDF format in one operation. Since every file is processed sequentially within your browser's local memory using WebAssembly, no document in your batch — however large or sensitive — is ever uploaded to an external server, and all memory buffers are released after each file completes to maintain stable performance throughout long batch runs.",
    category: "advanced",
    icon: "Layers3",
    keywords: ["batch process pdf", "bulk compress pdf files", "process multiple pdfs at once free"],
    acceptedFormats: [".pdf"],
    outputFormat: ".zip",
    priority: 0.5,
  },
];

export function getToolBySlug(slug: string): PdfTool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategoryId): PdfTool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getAllSlugs(): string[] {
  return TOOLS.map((tool) => tool.slug);
}

export function getRelatedTools(slug: string, limit = 4): PdfTool[] {
  const current = getToolBySlug(slug);
  if (!current) return [];
  return TOOLS.filter(
    (tool) => tool.category === current.category && tool.slug !== slug
  ).slice(0, limit);
}

export const TOTAL_TOOLS_COUNT = TOOLS.length;
