"use client";

import React, { useCallback, useState } from "react";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

async function loadPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  return pdfjsLib;
}

export default function PdfToWordProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError(null);
    setFile(selected);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const pdfjsLib = await loadPdfjs();
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let bodyHtml = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        bodyHtml += `<p>${pageText.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`;
        if (pageNum < pdf.numPages) {
          bodyHtml += `<p style="page-break-after:always;"></p>`;
        }
      }

      const documentHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="utf-8"><title>PDF Lovers Pro Export</title></head>
<body style="font-family:Calibri, Arial, sans-serif; font-size:12pt; line-height:1.5;">
${bodyHtml}
</body>
</html>`;

      const blob = new Blob([documentHtml], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not convert this PDF to Word. Please try a text-based PDF document.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-converted.doc";
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
        accept="application/pdf"
        multiple={false}
        label="Drag & drop a PDF file to convert to Word"
        hint="or click to browse — works best with text-based PDFs"
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
          {isProcessing ? "Converting…" : "Convert PDF to Word"}
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
            Download Word Document
          </button>
        )}
      </div>
    </div>
  );
}
