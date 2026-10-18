"use client";

import React, { useCallback, useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

type SplitMode = "all" | "range";

export default function SplitPdfProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<SplitMode>("all");
  const [rangeInput, setRangeInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = useCallback(async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError(null);
    setFile(selected);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Unable to read this PDF. Please upload a valid, non-corrupted file.");
      setFile(null);
    }
  }, []);

  const parseRanges = useCallback((input: string, total: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(total, end); i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= total) {
          indices.add(num - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  }, []);

  const handleSplit = useCallback(async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const buffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = sourceDoc.getPageCount();

      const pageIndices =
        mode === "all"
          ? Array.from({ length: totalPages }, (_, i) => i)
          : parseRanges(rangeInput, totalPages);

      if (pageIndices.length === 0) {
        setError("Please enter a valid page range, e.g. 1-3, 5, 7-9.");
        setIsProcessing(false);
        return;
      }

      const zip = new JSZip();

      for (const pageIndex of pageIndices) {
        const newDoc = await PDFDocument.create();
        const [copiedPage] = await newDoc.copyPages(sourceDoc, [pageIndex]);
        newDoc.addPage(copiedPage);
        const bytes = await newDoc.save();
        zip.file(`page-${pageIndex + 1}.pdf`, bytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not split this PDF. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, mode, rangeInput, parseRanges, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-split-pages.zip";
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
    setPageCount(0);
    setRangeInput("");
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
        label="Drag & drop a PDF file to split"
        hint="or click to browse — a single PDF document"
        onFilesSelected={handleFileSelected}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {file && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-800">
            {file.name} — {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="split-mode"
                checked={mode === "all"}
                onChange={() => setMode("all")}
              />
              Split every page into a separate PDF
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="split-mode"
                checked={mode === "range"}
                onChange={() => setMode("range")}
              />
              Extract a custom page range
            </label>
          </div>

          {mode === "range" && (
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-9"
              className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSplit}
          disabled={!file || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? "Splitting PDF…" : "Split PDF Now"}
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
            Download ZIP of Split Pages
          </button>
        )}
      </div>
    </div>
  );
}
