"use client";

import React, { useCallback, useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

type RotationAngle = 90 | 180 | 270;

export default function RotatePdfProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<RotationAngle>(90);
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

  const handleRotate = useCallback(async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      doc.getPages().forEach((page) => {
        const current = page.getRotation().angle;
        const next = (current + angle) % 360;
        page.setRotation(degrees(next));
      });

      const bytes = await doc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not rotate this PDF. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, angle, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-rotated.pdf";
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
        label="Drag & drop a PDF file to rotate"
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
            {[90, 180, 270].map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  name="rotate-angle"
                  checked={angle === option}
                  onChange={() => setAngle(option as RotationAngle)}
                />
                Rotate {option}° clockwise
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRotate}
          disabled={!file || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? "Rotating PDF…" : "Rotate PDF Now"}
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
            Download Rotated PDF
          </button>
        )}
      </div>
    </div>
  );
}
