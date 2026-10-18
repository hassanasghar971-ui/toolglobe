"use client";

import React, { useCallback, useState } from "react";
import JSZip from "jszip";
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

export default function PdfToImagesProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
    setProgress(0);
    registerInteraction();

    try {
      const pdfjsLib = await loadPdfjs();
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const zip = new JSZip();
      const extension = format === "image/png" ? "png" : "jpg";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        if (!context) continue;

        await page.render({ canvasContext: context, viewport }).promise;

        const dataUrl = canvas.toDataURL(format, 0.92);
        const base64 = dataUrl.split(",")[1];
        zip.file(`page-${pageNum}.${extension}`, base64, { base64: true });

        canvas.width = 0;
        canvas.height = 0;
        setProgress(Math.round((pageNum / pdf.numPages) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not convert this PDF to images. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, format, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-pages.zip";
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
    setProgress(0);
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
        label="Drag & drop a PDF file to convert to images"
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
          <p className="text-sm font-medium text-slate-800">{file.name}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="image-format"
                checked={format === "image/png"}
                onChange={() => setFormat("image/png")}
              />
              PNG (lossless)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="image-format"
                checked={format === "image/jpeg"}
                onChange={() => setFormat("image/jpeg")}
              />
              JPG (smaller size)
            </label>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleConvert}
          disabled={!file || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? `Converting… ${progress}%` : "Convert PDF to Images"}
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
            Download ZIP of Images
          </button>
        )}
      </div>
    </div>
  );
}
