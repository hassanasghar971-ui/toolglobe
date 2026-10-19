// lib/engines/file-engine.ts

export interface FileProcessResult {
  blob: Blob;
  dataUrl: string;
  fileName: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image. Please check the file format."));
    };
    img.src = url;
  });
}

function canvasToResult(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
  originalName: string,
  suffix: string,
  forceExtension?: string
): Promise<FileProcessResult> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image processing failed in this browser."));
          return;
        }
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const baseName = originalName.replace(/\.[^/.]+$/, "");
        const ext = forceExtension ?? mimeType.split("/")[1];
        resolve({ blob, dataUrl, fileName: `${baseName}-${suffix}.${ext}` });
      },
      mimeType,
      quality
    );
  });
}

export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.9
): Promise<FileProcessResult> {
  const img = await loadImage(file);
  let { width, height } = img;

  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser.");
  ctx.drawImage(img, 0, 0, width, height);

  return canvasToResult(canvas, file.type || "image/png", quality, file.name, "resized");
}

export async function compressImage(file: File, quality = 0.7): Promise<FileProcessResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser.");
  ctx.drawImage(img, 0, 0);

  return canvasToResult(canvas, "image/jpeg", quality, file.name, "compressed");
}

export async function convertImageFormat(
  file: File,
  targetMimeType: "image/png" | "image/jpeg" | "image/webp"
): Promise<FileProcessResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser.");
  ctx.drawImage(img, 0, 0);

  const extension = targetMimeType.split("/")[1];
  return canvasToResult(canvas, targetMimeType, 0.92, file.name, "converted", extension);
}
