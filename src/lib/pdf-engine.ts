import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

class MemoryManager {
  private activeUrls: Set<string> = new Set();

  createObjectUrl(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    this.activeUrls.add(url);
    return url;
  }

  revoke(url: string): void {
    if (this.activeUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.activeUrls.delete(url);
    }
  }

  revokeAll(): void {
    this.activeUrls.forEach((url) => URL.revokeObjectURL(url));
    this.activeUrls.clear();
  }

  get activeCount(): number {
    return this.activeUrls.size;
  }
}

export const memoryManager = new MemoryManager();

export async function downloadAndCleanup(
  data: Uint8Array | Blob,
  filename: string,
  mimeType = "application/pdf"
): Promise<void> {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([new Uint8Array(data)], { type: mimeType });

  const url = memoryManager.createObjectUrl(blob);
  saveAs(blob, filename);

  window.setTimeout(() => {
    memoryManager.revoke(url);
  }, 5000);
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

export async function loadPdfDocument(file: File): Promise<PDFDocument> {
  const buffer = await fileToArrayBuffer(file);
  return PDFDocument.load(buffer, { ignoreEncryption: true });
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const file of files) {
    const buffer = await fileToArrayBuffer(file);
    const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  mergedDoc.setProducer("PDF Lovers Pro - pdflovers.com");
  return await mergedDoc.save();
}

export async function splitPdfByRanges(
  file: File,
  ranges: number[][]
): Promise<Uint8Array[]> {
  const buffer = await fileToArrayBuffer(file);
  const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const results: Uint8Array[] = [];

  for (const range of ranges) {
    const newDoc = await PDFDocument.create();
    const indices = range.map((pageNum) => pageNum - 1);
    const pages = await newDoc.copyPages(sourceDoc, indices);
    pages.forEach((page) => newDoc.addPage(page));
    results.push(await newDoc.save());
  }

  return results;
}

export async function removePages(
  file: File,
  pageNumbersToRemove: number[]
): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const sortedDescending = [...pageNumbersToRemove]
    .map((n) => n - 1)
    .sort((a, b) => b - a);

  sortedDescending.forEach((index) => doc.removePage(index));
  return await doc.save();
}

export async function extractPages(
  file: File,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const indices = pageNumbers.map((n) => n - 1);
  const pages = await newDoc.copyPages(sourceDoc, indices);
  pages.forEach((page) => newDoc.addPage(page));
  return await newDoc.save();
}

export async function reorderPages(
  file: File,
  newPageOrder: number[]
): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const indices = newPageOrder.map((n) => n - 1);
  const pages = await newDoc.copyPages(sourceDoc, indices);
  pages.forEach((page) => newDoc.addPage(page));
  return await newDoc.save();
}

export async function rotatePdf(
  file: File,
  rotationDegrees: number,
  pageNumbers?: number[]
): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = doc.getPages();
  const targetIndices = pageNumbers
    ? pageNumbers.map((n) => n - 1)
    : pages.map((_, i) => i);

  targetIndices.forEach((index) => {
    const page = pages[index];
    if (!page) return;
    const currentAngle = page.getRotation().angle;
    page.setRotation(degrees((currentAngle + rotationDegrees) % 360));
  });

  return await doc.save();
}

export async function addTextWatermark(
  file: File,
  text: string,
  options: { opacity?: number; fontSize?: number; colorRgb?: [number, number, number] } = {}
): Promise<Uint8Array> {
  const { opacity = 0.3, fontSize = 48, colorRgb = [0.5, 0.5, 0.5] } = options;
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(colorRgb[0], colorRgb[1], colorRgb[2]),
      opacity,
      rotate: degrees(45),
    });
  });

  return await doc.save();
}

export async function addPageNumbers(
  file: File,
  options: { startAt?: number; position?: "bottom-center" | "bottom-right" | "top-right" } = {}
): Promise<Uint8Array> {
  const { startAt = 1, position = "bottom-center" } = options;
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  pages.forEach((page, idx) => {
    const { width } = page.getSize();
    const label = String(idx + startAt);
    const textWidth = font.widthOfTextAtSize(label, 10);

    let x = width / 2 - textWidth / 2;
    let y = 20;

    if (position === "bottom-right") {
      x = width - textWidth - 30;
    } else if (position === "top-right") {
      x = width - textWidth - 30;
      y = page.getSize().height - 30;
    }

    page.drawText(label, { x, y, size: 10, font, color: rgb(0, 0, 0) });
  });

  return await doc.save();
}

export async function cropPdfPages(
  file: File,
  margins: { top: number; bottom: number; left: number; right: number }
): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.setCropBox(
      margins.left,
      margins.bottom,
      width - margins.left - margins.right,
      height - margins.top - margins.bottom
    );
  });

  return await doc.save();
}

export async function updatePdfMetadata(
  file: File,
  metadata: { title?: string; author?: string; subject?: string; keywords?: string[] }
): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  if (metadata.title) doc.setTitle(metadata.title);
  if (metadata.author) doc.setAuthor(metadata.author);
  if (metadata.subject) doc.setSubject(metadata.subject);
  if (metadata.keywords) doc.setKeywords(metadata.keywords);

  doc.setProducer("PDF Lovers Pro - pdflovers.com");
  doc.setModificationDate(new Date());

  return await doc.save();
}

export async function compressPdf(file: File): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  return await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const file of files) {
    const buffer = await fileToArrayBuffer(file);
    const bytes = new Uint8Array(buffer);
    const isPng = file.type === "image/png";

    const image = isPng
      ? await doc.embedPng(bytes)
      : await doc.embedJpg(bytes);

    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await doc.save();
}

export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await fileToArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function renderPdfPageToDataUrl(
  file: File,
  pageNumber: number,
  scale = 2
): Promise<string> {
  const buffer = await fileToArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context could not be created.");
  }

  await page.render({ canvasContext: context, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

  canvas.width = 0;
  canvas.height = 0;
  page.cleanup();
  await pdf.destroy();

  return dataUrl;
}

export async function renderAllPagesAsThumbnails(
  file: File,
  scale = 0.5
): Promise<string[]> {
  const buffer = await fileToArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const thumbnails: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    if (context) {
      await page.render({ canvasContext: context, viewport }).promise;
      thumbnails.push(canvas.toDataURL("image/jpeg", 0.8));
    }

    canvas.width = 0;
    canvas.height = 0;
    page.cleanup();
  }

  await pdf.destroy();
  return thumbnails;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await fileToArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += strings + "\n\n";
    page.cleanup();
  }

  await pdf.destroy();
  return fullText.trim();
}

export function generateFilename(
  originalName: string,
  suffix: string,
  extension = "pdf"
): string {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  return `${baseName}-${suffix}.${extension}`;
}

export function clearEngineMemory(): void {
  memoryManager.revokeAll();
  if (typeof window !== "undefined" && "gc" in window) {
    (window as unknown as { gc: () => void }).gc();
  }
}
