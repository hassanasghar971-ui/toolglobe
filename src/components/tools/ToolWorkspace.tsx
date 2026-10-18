"use client";

import { useState } from "react";
import JSZip from "jszip";
import type { PdfTool } from "@/lib/tools-registry";
import {
  mergePdfs,
  splitPdfByRanges,
  removePages,
  extractPages,
  reorderPages,
  rotatePdf,
  addTextWatermark,
  addPageNumbers,
  cropPdfPages,
  updatePdfMetadata,
  compressPdf,
  imagesToPdf,
  getPdfPageCount,
  extractTextFromPdf,
  renderAllPagesAsThumbnails,
  downloadAndCleanup,
  generateFilename,
} from "@/lib/pdf-engine";
import FileDropzone from "./FileDropzone";

type WorkspaceState = "idle" | "ready" | "processing" | "done" | "error";

const MULTI_FILE_SLUGS = new Set(["merge-pdf", "jpg-to-pdf", "images-to-pdf"]);

const IMPLEMENTED_SLUGS = new Set([
  "merge-pdf",
  "split-pdf",
  "remove-pages",
  "extract-pages",
  "organize-pdf",
  "rotate-pdf",
  "compress-pdf",
  "repair-pdf",
  "add-watermark",
  "add-page-numbers",
  "crop-pdf",
  "pdf-metadata-editor",
  "pdf-page-counter",
  "pdf-to-text",
  "pdf-to-jpg",
  "jpg-to-pdf",
  "images-to-pdf",
]);

export default function ToolWorkspace({ tool }: { tool: PdfTool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<WorkspaceState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultInfo, setResultInfo] = useState("");

  const isMulti = MULTI_FILE_SLUGS.has(tool.slug);
  const isImplemented = IMPLEMENTED_SLUGS.has(tool.slug);
  const acceptString = tool.acceptedFormats
    .filter((f) => f !== "camera")
    .join(",");

  const resetWorkspace = () => {
    setFiles([]);
    setState("idle");
    setErrorMsg("");
    setResultInfo("");
  };

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected);
    setState("ready");
    setErrorMsg("");
    setResultInfo("");
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setState("processing");
    setErrorMsg("");

    try {
      switch (tool.slug) {
        case "merge-pdf": {
          const bytes = await mergePdfs(files);
          await downloadAndCleanup(bytes, "merged-document.pdf");
          break;
        }
        case "split-pdf": {
          const total = await getPdfPageCount(files[0]);
          const ranges = Array.from({ length: total }, (_, i) => [i + 1]);
          const results = await splitPdfByRanges(files[0], ranges);
          const zip = new JSZip();
          results.forEach((bytes, idx) =>
            zip.file(`page-${idx + 1}.pdf`, bytes)
          );
          const zipBlob = await zip.generateAsync({ type: "blob" });
          await downloadAndCleanup(
            zipBlob,
            generateFilename(files[0].name, "split", "zip"),
            "application/zip"
          );
          break;
        }
        case "remove-pages": {
          const total = await getPdfPageCount(files[0]);
          const bytes = await removePages(files[0], [total]);
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "pages-removed")
          );
          break;
        }
        case "extract-pages": {
          const total = await getPdfPageCount(files[0]);
          const bytes = await extractPages(files[0], [Math.min(1, total)]);
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "extracted")
          );
          break;
        }
        case "organize-pdf": {
          const total = await getPdfPageCount(files[0]);
          const order = Array.from({ length: total }, (_, i) => total - i);
          const bytes = await reorderPages(files[0], order);
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "organized")
          );
          break;
        }
        case "rotate-pdf": {
          const bytes = await rotatePdf(files[0], 90);
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "rotated")
          );
          break;
        }
        case "compress-pdf":
        case "repair-pdf": {
          const bytes = await compressPdf(files[0]);
          await downloadAndCleanup(
            bytes,
            generateFilename(
              files[0].name,
              tool.slug === "repair-pdf" ? "repaired" : "compressed"
            )
          );
          break;
        }
        case "add-watermark": {
          const bytes = await addTextWatermark(files[0], "CONFIDENTIAL");
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "watermarked")
          );
          break;
        }
        case "add-page-numbers": {
          const bytes = await addPageNumbers(files[0], {
            position: "bottom-center",
          });
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "numbered")
          );
          break;
        }
        case "crop-pdf": {
          const bytes = await cropPdfPages(files[0], {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          });
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "cropped")
          );
          break;
        }
        case "pdf-metadata-editor": {
          const bytes = await updatePdfMetadata(files[0], {
            title: files[0].name,
            author: "PDF Lovers Pro",
          });
          await downloadAndCleanup(
            bytes,
            generateFilename(files[0].name, "metadata-updated")
          );
          break;
        }
        case "pdf-page-counter": {
          const count = await getPdfPageCount(files[0]);
          setResultInfo(
            `${files[0].name} contains ${count} page${
              count === 1 ? "" : "s"
            }.`
          );
          setState("done");
          return;
        }
        case "pdf-to-text": {
          const text = await extractTextFromPdf(files[0]);
          const blob = new Blob([text], { type: "text/plain" });
          await downloadAndCleanup(
            blob,
            generateFilename(files[0].name, "extracted", "txt"),
            "text/plain"
          );
          break;
        }
        case "pdf-to-jpg": {
          const thumbnails = await renderAllPagesAsThumbnails(files[0], 2);
          const zip = new JSZip();
          thumbnails.forEach((dataUrl, idx) => {
            const base64 = dataUrl.split(",")[1];
            zip.file(`page-${idx + 1}.jpg`, base64, { base64: true });
          });
          const zipBlob = await zip.generateAsync({ type: "blob" });
          await downloadAndCleanup(
            zipBlob,
            generateFilename(files[0].name, "images", "zip"),
            "application/zip"
          );
          break;
        }
        case "jpg-to-pdf":
        case "images-to-pdf": {
          const bytes = await imagesToPdf(files);
          await downloadAndCleanup(bytes, "converted-images.pdf");
          break;
        }
        default:
          throw new Error("UNSUPPORTED_TOOL");
      }

      setState("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "We couldn't process this file. Please ensure it's a valid, non-corrupted file and try again."
      );
      setState("error");
    }
  };

  if (!isImplemented) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <div className="mb-3 text-3xl">🚧</div>
        <h2 className="text-lg font-bold text-amber-900">
          {tool.name} Engine Launching Soon
        </h2>
        <p className="mt-2 text-sm text-amber-800">
          This tool's dedicated client-side processing engine is currently
          being finalized and will be enabled in an upcoming deployment. All
          other tools on PDF Lovers Pro remain fully functional today.
        </p>
        <FileDropzone
          accept={acceptString}
          multiple={isMulti}
          onFilesSelected={() => undefined}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {state === "idle" && (
        <FileDropzone
          accept={acceptString}
          multiple={isMulti}
          onFilesSelected={handleFilesSelected}
        />
      )}

      {state === "ready" && (
        <div>
          <ul className="mb-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="truncate font-medium text-slate-800">
                  {file.name}
                </span>
                <span className="text-slate-400">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={handleProcess} className="btn-primary flex-1">
              Process {tool.name}
            </button>
            <button onClick={resetWorkspace} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>
      )}

      {state === "processing" && (
        <div className="flex flex-col items-center justify-center py-14">
          <div className="mb-4 h-12 w-12 animate-spin-slow rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="font-semibold text-slate-700">
            Processing locally in your browser...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Your file never leaves your device.
          </p>
        </div>
      )}

      {state === "done" && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✅
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {resultInfo ? "Analysis Complete" : "Your File Is Ready!"}
          </h3>
          {resultInfo ? (
            <p className="mt-2 text-sm text-slate-600">{resultInfo}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Your download should have started automatically.
            </p>
          )}
          <button onClick={resetWorkspace} className="btn-primary mt-6">
            Process Another File
          </button>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Processing Failed
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-600">{errorMsg}</p>
          <button onClick={resetWorkspace} className="btn-primary mt-6">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
