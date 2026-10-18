"use client";

import { useCallback, useRef, useState } from "react";

export default function FileDropzone({
  accept,
  multiple,
  onFilesSelected,
}: {
  accept: string;
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      onFilesSelected(multiple ? files : [files[0]]);
    },
    [multiple, onFilesSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
      }`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
        📤
      </div>
      <p className="font-semibold text-slate-800">
        Drag &amp; drop your file{multiple ? "s" : ""} here
      </p>
      <p className="mt-1 text-sm text-slate-500">or click to browse</p>
      <p className="mt-4 text-xs text-slate-400">
        Accepted: {accept || "any file"}
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
