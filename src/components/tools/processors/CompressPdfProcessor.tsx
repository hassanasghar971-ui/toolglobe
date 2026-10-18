"use client";

import React, { useCallback, useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

type CompressionLevel = "light" | "strong";

async function loadPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  return pdfjsLib;
}

export default function CompressPdfProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("light");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileSelected = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setError(null);
    setFile(selected);
    setOriginalSize(selected.size);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const compressLight = useCallback(async (buffer: ArrayBuffer) => {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return doc.save({ useObjectStreams: true, addDefaultPage: false });
  }, []);

  const compressStrong = useCallback(async (buffer: ArrayBuffer) => {
    const pdfjsLib = await loadPdfjs();
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    const outDoc = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.1 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (!context) continue;

      await page.render({ canvasContext: context, viewport }).promise;

      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.55);
      const jpegBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());
      const embeddedImage = await outDoc.embedJpg(jpegBytes);

      const newPage = outDoc.addPage([viewport.width, viewport.height]);
      newPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });

      canvas.width = 0;
      canvas.height = 0;
    }

    return outDoc.save({ useObjectStreams: true });
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const buffer = await file.arrayBuffer();
      const outputBytes =
        level === "light" ? await compressLight(buffer) : await compressStrong(buffer);

      const blob = new Blob([outputBytes], { type: "application/pdf" });
      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not compress this PDF. Please try a different file or compression mode.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, level, compressLight, compressStrong, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-compressed.pdf";
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
    setOriginalSize(0);
    setCompressedSize(0);
    setError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : null;

  return (
    <div className="w-full space-y-6">
      <FileDropzone
        accept="application/pdf"
        multiple={false}
        label="Drag & drop a PDF file to compress"
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
            {file.name} — {(originalSize / 1024).toFixed(1)} KB
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="compress-level"
                checked={level === "light"}
                onChange={() => setLevel("light")}
              />
              Light compression (preserves text & quality)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="compress-level"
                checked={level === "strong"}
                onChange={() => setLevel("strong")}
              />
              Strong compression (best for scanned / image-heavy PDFs)
            </label>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCompress}
          disabled={!file || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? "Compressing PDF…" : "Compress PDF Now"}
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
            Download Compressed PDF
          </button>
        )}
      </div>

      {savingsPercent !== null && (
        <p className="text-sm text-slate-500">
          New size: {(compressedSize / 1024).toFixed(1)} KB — approximately {savingsPercent}% smaller.
        </p>
      )}
    </div>
  );
}
