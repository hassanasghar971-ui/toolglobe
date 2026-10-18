"use client";

import React, { useCallback, useState } from "react";
import { PDFDocument } from "@cantoo/pdf-lib";
import FileDropzone from "@/components/ui/FileDropzone";
import { useInteraction } from "@/context/InteractionContext";

export default function UnlockPdfProcessor() {
  const { registerInteraction } = useInteraction();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
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

  const handleUnlock = useCallback(async () => {
    if (!file) {
      setError("Please upload a password-protected PDF file first.");
      return;
    }
    if (!password) {
      setError("Please enter the current password of this PDF.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    registerInteraction();

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { password });
      const bytes = await doc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError(
        "We could not unlock this PDF. Please double-check that you entered the correct password."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [file, password, registerInteraction]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    anchor.download = "pdflovers-unlocked.pdf";
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
    setPassword("");
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
        label="Drag & drop a password-protected PDF file"
        hint="or click to browse — you must know the current password"
        onFilesSelected={handleFileSelected}
      />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        This tool only removes password protection from PDFs you own or have explicit permission
        to access, using a password you already know. It does not crack, guess, or bypass
        encryption.
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {file && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-800">{file.name}</p>
          <label className="mt-3 block text-xs font-semibold text-slate-500">
            Current PDF Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
            placeholder="Enter the existing password"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleUnlock}
          disabled={!file || isProcessing}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? "Unlocking PDF…" : "Unlock PDF"}
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
            Download Unlocked PDF
          </button>
        )}
      </div>
    </div>
  );
}
