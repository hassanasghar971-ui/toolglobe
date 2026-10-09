'use client';

import { useState, useRef, useMemo, ChangeEvent } from 'react';

export type EngineType = 'code' | 'text' | 'media' | 'calc';

interface ToolEngineProps {
  toolTitle: string;
  category: string;
  engineType: EngineType;
}

const MAX_TEXT_CHARS = 50000;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

type CodeMode = 'json-format' | 'json-validate' | 'base64-encode' | 'base64-decode' | 'url-encode' | 'url-decode';
type TextMode = 'counter' | 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'clean' | 'slug' | 'keywords';
type CalcTab = 'stats' | 'percentage';

export default function ToolEngine({ toolTitle, category, engineType }: ToolEngineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {engineType === 'code' && <CodeEngine toolTitle={toolTitle} />}
      {engineType === 'text' && <TextEngine toolTitle={toolTitle} />}
      {engineType === 'media' && <MediaEngine toolTitle={toolTitle} category={category} />}
      {engineType === 'calc' && <CalcEngine toolTitle={toolTitle} />}
    </div>
  );
}

/* ============================================================ */
/* CODE ENGINE — JSON Format/Validate, Base64, URL Encode/Decode */
/* ============================================================ */
function CodeEngine({ toolTitle }: { toolTitle: string }) {
  const [mode, setMode] = useState<CodeMode>('json-format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const modes: { id: CodeMode; label: string }[] = [
    { id: 'json-format', label: 'JSON Format' },
    { id: 'json-validate', label: 'JSON Validate' },
    { id: 'base64-encode', label: 'Base64 Encode' },
    { id: 'base64-decode', label: 'Base64 Decode' },
    { id: 'url-encode', label: 'URL Encode' },
    { id: 'url-decode', label: 'URL Decode' },
  ];

  const overLimit = input.length > MAX_TEXT_CHARS;

  const handleProcess = () => {
    if (!input.trim() || overLimit) return;
    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      try {
        let result = '';
        switch (mode) {
          case 'json-format':
            result = JSON.stringify(JSON.parse(input), null, 2);
            break;
          case 'json-validate':
            JSON.parse(input);
            result = '✅ Valid JSON. No syntax errors found.';
            break;
          case 'base64-encode':
            result = btoa(unescape(encodeURIComponent(input)));
            break;
          case 'base64-decode':
            result = decodeURIComponent(escape(atob(input.trim())));
            break;
          case 'url-encode':
            result = encodeURIComponent(input);
            break;
          case 'url-decode':
            result = decodeURIComponent(input);
            break;
        }
        setOutput(result);
      } catch (err) {
        setError(`Processing failed: ${(err as Error).message}`);
        setOutput('');
      } finally {
        setIsProcessing(false);
      }
    }, 200);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy to clipboard. Please copy the text manually.');
    }
  };

  return (
    <div className="glass-card p-6">
      <EngineHeader title={toolTitle} />

      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Code tool modes">
        {modes.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => {
              setMode(m.id);
              setOutput('');
              setError(null);
            }}
            className={`tool-tab ${mode === m.id ? 'tool-tab-active' : 'tool-tab-inactive'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="code-input" className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Input
          </label>
          <textarea
            id="code-input"
            aria-label="Code input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON, Base64 string, or URL text here..."
            className="input-field h-56 font-mono resize-none"
            maxLength={MAX_TEXT_CHARS + 500}
          />
          <p className={`text-xs mt-1 ${overLimit ? 'text-red-600' : 'text-gray-400'}`}>
            {input.length.toLocaleString()} / {MAX_TEXT_CHARS.toLocaleString()} characters
            {overLimit && ' — limit exceeded, please shorten input.'}
          </p>
        </div>

        <div>
          <label htmlFor="code-output" className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Output
          </label>
          <textarea
            id="code-output"
            aria-label="Processed output"
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="input-field h-56 font-mono resize-none bg-gray-50"
          />
          {error && (
            <p role="alert" className="text-xs text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>

      <ActionBar
        onProcess={handleProcess}
        onCopy={handleCopy}
        isProcessing={isProcessing}
        disabled={!input.trim() || overLimit}
        hasOutput={!!output}
        copied={copied}
      />
    </div>
  );
}

/* ============================================================ */
/* TEXT ENGINE — Counter, Case Converter, Cleaner, Slug, Keywords */
/* ============================================================ */
function TextEngine({ toolTitle }: { toolTitle: string }) {
  const [mode, setMode] = useState<TextMode>('counter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modes: { id: TextMode; label: string }[] = [
    { id: 'counter', label: 'Word & Char Counter' },
    { id: 'uppercase', label: 'UPPERCASE' },
    { id: 'lowercase', label: 'lowercase' },
    { id: 'titlecase', label: 'Title Case' },
    { id: 'sentencecase', label: 'Sentence case' },
    { id: 'clean', label: 'Clean Extra Spaces' },
    { id: 'slug', label: 'Slug Generator' },
    { id: 'keywords', label: 'Keyword Density' },
  ];

  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, sentences, readingTime };
  }, [input]);

  const overLimit = input.length > MAX_TEXT_CHARS;

  const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const toSentenceCase = (str: string) =>
    str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  const toSlug = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const keywordDensity = (str: string) => {
    const words = str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    if (sorted.length === 0) return 'No significant keywords found.';
    return sorted
      .map(
        ([word, count], i) =>
          `${i + 1}. "${word}" — ${count} occurrences (${((count / words.length) * 100).toFixed(1)}%)`
      )
      .join('\n');
  };

  const handleProcess = () => {
    if (!input.trim() || overLimit) return;
    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      let result = '';
      switch (mode) {
        case 'counter':
          result = `Words: ${stats.words}\nCharacters (with spaces): ${stats.chars}\nCharacters (no spaces): ${stats.charsNoSpaces}\nSentences: ${stats.sentences}\nEstimated reading time: ${stats.readingTime} min`;
          break;
        case 'uppercase':
          result = input.toUpperCase();
          break;
        case 'lowercase':
          result = input.toLowerCase();
          break;
        case 'titlecase':
          result = toTitleCase(input);
          break;
        case 'sentencecase':
          result = toSentenceCase(input);
          break;
        case 'clean':
          result = input.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
          break;
        case 'slug':
          result = toSlug(input);
          break;
        case 'keywords':
          result = keywordDensity(input);
          break;
      }
      setOutput(result);
      setIsProcessing(false);
    }, 200);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy to clipboard. Please copy the text manually.');
    }
  };

  return (
    <div className="glass-card p-6">
      <EngineHeader title={toolTitle} />

      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Text tool modes">
        {modes.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => {
              setMode(m.id);
              setOutput('');
            }}
            className={`tool-tab ${mode === m.id ? 'tool-tab-active' : 'tool-tab-inactive'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5 text-center">
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Characters" value={stats.chars} />
        <StatBox label="No Spaces" value={stats.charsNoSpaces} />
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Read Time" value={`${stats.readingTime}m`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="text-input" className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Input Text
          </label>
          <textarea
            id="text-input"
            aria-label="Text input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your content here..."
            className="input-field h-56 resize-none"
            maxLength={MAX_TEXT_CHARS + 500}
          />
          <p className={`text-xs mt-1 ${overLimit ? 'text-red-600' : 'text-gray-400'}`}>
            {input.length.toLocaleString()} / {MAX_TEXT_CHARS.toLocaleString()} characters
          </p>
        </div>

        <div>
          <label htmlFor="text-output" className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Result
          </label>
          <textarea
            id="text-output"
            aria-label="Processed text output"
            value={output}
            readOnly
            placeholder="Processed result will appear here..."
            className="input-field h-56 resize-none bg-gray-50"
          />
          {error && (
            <p role="alert" className="text-xs text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>

      <ActionBar
        onProcess={handleProcess}
        onCopy={handleCopy}
        isProcessing={isProcessing}
        disabled={!input.trim() || overLimit}
        hasOutput={!!output}
        copied={copied}
      />
    </div>
  );
}

/* ============================================================ */
/* MEDIA ENGINE — Image Resize/Inspect, Video Metadata/Thumbnail */
/* ============================================================ */
function MediaEngine({ toolTitle, category }: { toolTitle: string; category: string }) {
  const isVideo = category === 'video-utilities';
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, string | number>>({});
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setError(null);
    setResultUrl('');
    if (!f) return;

    if (f.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum allowed size is ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB.`);
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    if (!isVideo) {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
        setMetadata({
          'File Name': f.name,
          'File Size': `${(f.size / 1024).toFixed(1)} KB`,
          Type: f.type || 'unknown',
          Dimensions: `${img.width} × ${img.height}px`,
        });
      };
      img.onerror = () => setError('Unable to read image file. Please try another file.');
      img.src = url;
    } else {
      setMetadata({
        'File Name': f.name,
        'File Size': `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
        Type: f.type || 'unknown',
      });
    }
  };

  const handleVideoMeta = () => {
    const v = videoRef.current;
    if (!v) return;
    setMetadata((prev) => ({
      ...prev,
      Duration: `${v.duration.toFixed(1)}s`,
      Dimensions: `${v.videoWidth} × ${v.videoHeight}px`,
    }));
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepRatio && aspectRatio) setHeight(Math.round(val / aspectRatio));
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepRatio && aspectRatio) setWidth(Math.round(val * aspectRatio));
  };

  const handleResize = () => {
    if (!previewUrl || !canvasRef.current || width <= 0 || height <= 0) return;
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = canvasRef.current!;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas rendering not supported.');
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        setResultUrl(canvas.toDataURL(file?.type || 'image/png'));
      } catch (err) {
        setError(`Resize failed: ${(err as Error).message}`);
      } finally {
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setError('Unable to process image.');
      setIsProcessing(false);
    };
    img.src = previewUrl;
  };

  const handleCaptureThumbnail = () => {
    const v = videoRef.current;
    const canvas = canvasRef.current;
    if (!v || !canvas) return;
    setIsProcessing(true);
    setError(null);
    try {
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas rendering not supported.');
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      setResultUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      setError(`Thumbnail capture failed: ${(err as Error).message}. Some video sources block frame capture.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = isVideo ? 'thumbnail.png' : `resized-${width}x${height}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="glass-card p-6">
      <EngineHeader title={toolTitle} />

      <div className="mb-5">
        <label htmlFor="media-input" className="block text-xs font-bold text-gray-700 uppercase mb-2">
          {isVideo ? 'Upload Video File' : 'Upload Image File'}
        </label>
        <input
          id="media-input"
          type="file"
          accept={isVideo ? 'video/*' : 'image/*'}
          onChange={handleFile}
          aria-label={isVideo ? 'Upload video file' : 'Upload image file'}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">
          Max file size: {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB. Processed entirely in your browser.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 mb-4">
          {error}
        </p>
      )}

      {previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase mb-2">Preview</p>
            {isVideo ? (
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                onLoadedMetadata={handleVideoMeta}
                className="w-full rounded-xl border border-gray-200 max-h-64 bg-black"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="w-full rounded-xl border border-gray-200 max-h-64 object-contain bg-gray-50"
              />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-700 uppercase mb-2">File Metadata</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
              {Object.entries(metadata).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isVideo && previewUrl && (
        <div className="flex flex-wrap items-end gap-4 mb-5">
          <div>
            <label htmlFor="resize-width" className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Width (px)
            </label>
            <input
              id="resize-width"
              type="number"
              min={1}
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="input-field w-28"
              aria-label="Resize width in pixels"
            />
          </div>
          <div>
            <label htmlFor="resize-height" className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Height (px)
            </label>
            <input
              id="resize-height"
              type="number"
              min={1}
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="input-field w-28"
              aria-label="Resize height in pixels"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-2.5">
            <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
            Lock aspect ratio
          </label>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="flex flex-wrap gap-3 items-center">
        {isVideo ? (
          <button
            onClick={handleCaptureThumbnail}
            disabled={!previewUrl || isProcessing}
            className="btn-primary"
            aria-label="Capture video thumbnail"
          >
            {isProcessing ? 'Capturing...' : 'Capture Thumbnail'}
          </button>
        ) : (
          <button
            onClick={handleResize}
            disabled={!previewUrl || isProcessing}
            className="btn-primary"
            aria-label="Resize image"
          >
            {isProcessing ? 'Processing...' : 'Resize & Generate'}
          </button>
        )}
        {resultUrl && (
          <button onClick={handleDownload} className="btn-secondary" aria-label="Download result">
            Download Result
          </button>
        )}
      </div>

      {resultUrl && (
        <div className="mt-5">
          <p className="text-xs font-bold text-gray-700 uppercase mb-2">Result Preview</p>
          <img
            src={resultUrl}
            alt="Processed result"
            className="max-w-full rounded-xl border border-gray-200 max-h-64 object-contain bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}

/* ============================================================ */
/* CALC ENGINE — List Statistics & Percentage Calculator          */
/* ============================================================ */
function CalcEngine({ toolTitle }: { toolTitle: string }) {
  const [tab, setTab] = useState<CalcTab>('stats');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [value, setValue] = useState('');
  const [total, setTotal] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const overLimit = input.length > MAX_TEXT_CHARS;

  const handleStats = () => {
    const numbers = input
      .split(/[,\s\n]+/)
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v));

    if (numbers.length === 0) {
      setError('No valid numbers found. Please enter numbers separated by commas, spaces, or new lines.');
      setOutput('');
      return;
    }

    const sum = numbers.reduce((a, b) => a + b, 0);
    const avg = sum / numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    setOutput(
      `Count: ${numbers.length}\nSum: ${sum.toFixed(2)}\nAverage: ${avg.toFixed(2)}\nMinimum: ${Math.min(
        ...numbers
      )}\nMaximum: ${Math.max(...numbers)}\nMedian: ${median.toFixed(2)}`
    );
    setError(null);
  };

  const handlePercentage = () => {
    const v = parseFloat(value);
    const t = parseFloat(total);
    if (isNaN(v) || isNaN(t) || t === 0) {
      setError('Please enter valid numeric values (total must not be zero).');
      setOutput('');
      return;
    }
    const percentage = (v / t) * 100;
    setOutput(
      `${v} is ${percentage.toFixed(2)}% of ${t}\n${t} increased by 10% = ${(t * 1.1).toFixed(2)}\n${t} decreased by 10% = ${(
        t * 0.9
      ).toFixed(2)}`
    );
    setError(null);
  };

  const handleProcess = () => {
    if (tab === 'stats' && (overLimit || !input.trim())) return;
    setIsProcessing(true);
    setTimeout(() => {
      if (tab === 'stats') handleStats();
      else handlePercentage();
      setIsProcessing(false);
    }, 200);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy to clipboard. Please copy the text manually.');
    }
  };

  return (
    <div className="glass-card p-6">
      <EngineHeader title={toolTitle} />

      <div className="flex gap-2 mb-5" role="tablist" aria-label="Calculator modes">
        <button
          role="tab"
          aria-selected={tab === 'stats'}
          onClick={() => {
            setTab('stats');
            setOutput('');
            setError(null);
          }}
          className={`tool-tab ${tab === 'stats' ? 'tool-tab-active' : 'tool-tab-inactive'}`}
        >
          List Statistics
        </button>
        <button
          role="tab"
          aria-selected={tab === 'percentage'}
          onClick={() => {
            setTab('percentage');
            setOutput('');
            setError(null);
          }}
          className={`tool-tab ${tab === 'percentage' ? 'tool-tab-active' : 'tool-tab-inactive'}`}
        >
          Percentage Calculator
        </button>
      </div>

      {tab === 'stats' ? (
        <div>
          <label htmlFor="calc-input" className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Numbers (comma, space, or newline separated)
          </label>
          <textarea
            id="calc-input"
            aria-label="Number list input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 12, 45, 78, 23, 90"
            className="input-field h-32 resize-none font-mono"
            maxLength={MAX_TEXT_CHARS + 500}
          />
          <p className={`text-xs mt-1 ${overLimit ? 'text-red-600' : 'text-gray-400'}`}>
            {input.length.toLocaleString()} / {MAX_TEXT_CHARS.toLocaleString()} characters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calc-value" className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Value
            </label>
            <input
              id="calc-value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-field"
              aria-label="Percentage value"
            />
          </div>
          <div>
            <label htmlFor="calc-total" className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Total
            </label>
            <input
              id="calc-total"
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="input-field"
              aria-label="Percentage total"
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="calc-output" className="block text-xs font-bold text-gray-700 uppercase mb-2">
          Result
        </label>
        <textarea
          id="calc-output"
          aria-label="Calculation result"
          value={output}
          readOnly
          placeholder="Results will appear here..."
          className="input-field h-32 resize-none bg-gray-50 font-mono"
        />
        {error && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {error}
          </p>
        )}
      </div>

      <ActionBar
        onProcess={handleProcess}
        onCopy={handleCopy}
        isProcessing={isProcessing}
        disabled={tab === 'stats' ? !input.trim() || overLimit : !value || !total}
        hasOutput={!!output}
        copied={copied}
      />
    </div>
  );
}

/* ============================================================ */
/* SHARED UI PIECES                                                */
/* ============================================================ */
function EngineHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 flex justify-between items-center flex-wrap gap-2">
      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
        Live Client-Side Workspace
      </span>
      <span className="text-xs text-gray-400 font-mono truncate max-w-[60%]" title={title}>
        {title}
      </span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-1">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function ActionBar({
  onProcess,
  onCopy,
  isProcessing,
  disabled,
  hasOutput,
  copied,
}: {
  onProcess: () => void;
  onCopy: () => void;
  isProcessing: boolean;
  disabled: boolean;
  hasOutput: boolean;
  copied: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-3 items-center">
      <button
        onClick={onProcess}
        disabled={disabled || isProcessing}
        className="btn-primary"
        aria-label="Execute tool processing"
      >
        {isProcessing ? 'Processing...' : 'Execute Tool'}
      </button>
      {hasOutput && (
        <button onClick={onCopy} className="btn-secondary" aria-label="Copy result to clipboard">
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      )}
    </div>
  );
}
