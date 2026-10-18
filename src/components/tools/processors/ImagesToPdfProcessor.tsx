"use client";

import React, { useCallback, useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

interface SelectedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImagesToPdfProcessor() {
  const { registerInteraction } = useInteraction();
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = useCallback((files: File[]) => {
    setError(null);
    const validImages = files.filter((f) => f.type === "image/jpeg" || f.type === "image/png");
    if (validImages.length === 0) {
      setError("Please upload JPG or PNG image files only.");
      return;
    }
    setImages((prev) => [
      ...prev,
      ...validImages.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleReset = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [images]);

  const handleConvert = useCallback(async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const pdfDoc = await PDFDocument.create();

      for (const { file } of images) {
        const arrayBuffer = await file.arrayBuffer();
        const embeddedImage =
          file.type === "image/png"
            ? await pdfDoc.embedPng(arrayBuffer)
            : await pdfDoc.embedJpg(arrayBuffer);

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, { x: 0, y: 0, width, height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("We could not convert these images. Please ensure they are valid JPG or PNG files.");
    } finally {
      setIsProcessing(false);
    }
  }, [images, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-images-to-pdf.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    registerInteraction();
    setTimeout(() => {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }, 2000);
  }, [resultUrl, registerInteraction]);

  return (
    <div className="w-full space-y-6">
      <FileDropzone
        accept="image/jpeg,image/png"
        multiple
        maxFiles={50}
        label="Drag & drop JPG or PNG images here"
        hint="or click to browse — select one or more images"
        onFilesSelected={handleFilesSelected}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div key={img.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src={img.previewUrl} alt={img.file.name} className="h-32 w-full object-cover" />
              <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white hover:bg-red-700"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleConvert}
          disabled={images.length === 0 || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? "Converting…" : "Convert to PDF"}
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
