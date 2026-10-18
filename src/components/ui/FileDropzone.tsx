"use client";

import React, { useCallback, useRef, useState } from "react";

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  hint?: string;
  onFilesSelected: (files: File[]) => void;
}

export default function FileDropzone({
  accept = "application/pdf",
  multiple = false,
  maxFiles = 20,
  label = "Drag & drop your PDF files here",
  hint = "or click to browse from your device",
  onFilesSelected,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList).slice(0, maxFiles);
      onFilesSelected(files);
    },
    [maxFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors duration-200 cursor-pointer select-none ${
        isDragging
          ? "border-red-500 bg-red-50"
          : "border-slate-300 bg-slate-50 hover:border-red-400 hover:bg-red-50/40"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 h-12 w-12 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 16.5V9m0 0l-3 3m3-3l3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25H15l-1.5-1.5h-3L9 6.75H6.75A2.25 2.25 0 004.5 9v8.25a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
      <p className="text-base font-semibold text-slate-800">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
      <p className="mt-3 text-xs text-slate-400">
        100% Secure — Files are processed locally in your browser and never uploaded to any server.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
