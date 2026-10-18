"use client";

import React, { useCallback, useState } from "react";
import JSZip from "jszip";
import { PDFDocument, StandardFonts, PDFFont, rgb } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractParagraphsFromDocumentXml(xml: string): string[] {
  const paragraphMatches = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  return paragraphMatches
    .map((paragraph) => {
      const textMatches = paragraph.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      const combined = textMatches
        .map((match) => {
          const inner = match.replace(/<w:t[^>]*>/, "").replace(/<\/w:t>/, "");
          return decodeXmlEntities(inner);
        })
        .join("");
      return combined.trim();
    })
    .filter((line) => line.length > 0);
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export default function WordToPdfProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a .docx Word document. Legacy .doc files are not supported.");
      return;
    }
    setError(null);
    setFile(selected);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) {
      setError("Please upload a .docx Word document first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const documentXmlFile = zip.file("word/document.xml");

      if (!documentXmlFile) {
        throw new Error("Invalid DOCX structure");
      }

      const documentXml = await documentXmlFile.async("string");
      const paragraphs = extractParagraphsFromDocumentXml(documentXml);

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const fontSize = 12;
      const lineHeight = 17;
      const maxWidth = pageWidth - margin * 2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      const ensureSpace = () => {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
      };

      if (paragraphs.length === 0) {
        page.drawText("This document contains no readable text content.", {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      }

      for (const paragraph of paragraphs) {
        const lines = wrapText(paragraph, font, fontSize, maxWidth);
        for (const line of lines) {
          ensureSpace();
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
          y -= lineHeight;
        }
        y -= lineHeight * 0.5;
        ensureSpace();
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError(
        "We could not convert this Word document. Please ensure it is a valid, non-corrupted .docx file."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [file, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-converted.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    registerInteraction();
    setTimeout(() => {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }, 2000);
  }, [resultUrl, registerInteraction]);

  const handleReset = useCallback(() => {
    setFile(null);
    setError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  return (
    <div className="w-full space-y-6">
      <FileDropzone
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        label="Drag & drop a .docx Word file to convert to PDF"
        hint="or click to browse — Microsoft Word .docx files only"
        onFilesSelected={handleFileSelected}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {file && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-800">{file.name}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleConvert}
          disabled={!file || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? "Converting…" : "Convert Word to PDF"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
        {resultUrl && (
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
}
