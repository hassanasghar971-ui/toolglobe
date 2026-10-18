"use client";

import React, { useCallback, useState } from "react";
import PptxGenJS from "pptxgenjs";
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

export default function PdfToPptxProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
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
      const pptx = new PptxGenJS();

      const firstPage = await pdf.getPage(1);
      const firstViewport = firstPage.getViewport({ scale: 2 });
      const widthInInches = Math.min(56, firstViewport.width / 96);
      const heightInInches = Math.min(56, firstViewport.height / 96);

      pptx.defineLayout({ name: "PDFLOVERS_LAYOUT", width: widthInInches, height: heightInInches });
      pptx.layout = "PDFLOVERS_LAYOUT";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        if (!context) continue;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

        const slide = pptx.addSlide();
        slide.addImage({
          data: dataUrl,
          x: 0,
          y: 0,
          w: widthInInches,
          h: heightInInches,
        });

        canvas.width = 0;
        canvas.height = 0;
        setProgress(Math.round((pageNum / pdf.numPages) * 100));
      }

      const blob = (await pptx.write({ outputType: "blob" })) as Blob;
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not convert this PDF to PowerPoint. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-presentation.pptx";
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
        label="Drag & drop a PDF file to convert to PowerPoint"
        hint="or click to browse — each page becomes one slide"
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
          {isProcessing ? `Converting… ${progress}%` : "Convert PDF to PPTX"}
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
            Download PowerPoint File
          </button>
        )}
      </div>
    </div>
  );
}
