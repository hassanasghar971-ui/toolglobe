'use client';

// TextTransformer — case conversion, encode/decode, cryptographic hashing,
// and text analytics, all behind one `mode` prop. Outputs are rendered as
// plain text nodes only (never dangerouslySetInnerHTML) — React's default
// escaping makes the DOM safe regardless of input content, so transforms
// below intentionally preserve byte-for-byte fidelity (stripping/escaping
// the raw input here would corrupt legitimate hash/encode results). We still
// guard against DoS via enforceSizeLimit on every keystroke.

import { useEffect, useMemo, useState } from 'react';
import { escapeHtml, enforceSizeLimit, sanitizeString } from '@/lib/sanitizer';
import { md5, sha } from '@/lib/hash-utils';

/* --------------------------------- Types --------------------------------- */

type ModeGroup = 'case' | 'encode' | 'hash' | 'analytics';

interface ModeDef {
  label: string;
  group: ModeGroup;
  transform?: (input: string) => string;       // case & encode groups
  hash?: (input: string) => Promise<string>;    // hash group
}

export interface TextTransformerProps {
  mode: string;
  title?: string;
}

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeSec: number;
  byteSize: number;
  topChars: { char: string; count: number }[];
}

/* ------------------------------- Transform Utils ------------------------------- */

function splitWords(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(b64: string): string {
  const binary = atob(b64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeHtmlEntities(s: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const num = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(num) ? String.fromCodePoint(num) : match;
    }
    return named[entity] ?? match;
  });
}

function rot13(s: string): string {
  return s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function analyzeText(s: string): TextStats {
  const characters = s.length;
  const charactersNoSpaces = s.replace(/\s/g, '').length;
  const words = (s.trim().match(/\S+/g) || []).length;
  const sentenceMatches = s.match(/[^.!?]+[.!?]+/g);
  const sentences = sentenceMatches ? sentenceMatches.length : s.trim() ? 1 : 0;
  const paragraphs = s.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (s.trim() ? 1 : 0);
  const readingTimeSec = Math.ceil((words / 200) * 60);
  const byteSize = new Blob([s]).size;

  const freq: Record<string, number> = {};
  for (const ch of s.toLowerCase()) {
    if (/[a-z0-9]/.test(ch)) freq[ch] = (freq[ch] || 0) + 1;
  }
  const topChars = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([char, count]) => ({ char, count }));

  return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTimeSec, byteSize, topChars };
}

/* --------------------------------- Mode Registry --------------------------------- */

export const MODE_DEFS: Record<string, ModeDef> = {
  uppercase: { label: 'UPPERCASE', group: 'case', transform: (s) => s.toUpperCase() },
  lowercase: { label: 'lowercase', group: 'case', transform: (s) => s.toLowerCase() },
  titlecase: {
    label: 'Title Case', group: 'case',
    transform: (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  sentencecase: {
    label: 'Sentence case', group: 'case',
    transform: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  camelcase: {
    label: 'camelCase', group: 'case',
    transform: (s) => splitWords(s).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join(''),
  },
  pascalcase: {
    label: 'PascalCase', group: 'case',
    transform: (s) => splitWords(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
  },
  snakecase: { label: 'snake_case', group: 'case', transform: (s) => splitWords(s).map((w) => w.toLowerCase()).join('_') },
  kebabcase: { label: 'kebab-case', group: 'case', transform: (s) => splitWords(s).map((w) => w.toLowerCase()).join('-') },
  alternatingcase: {
    label: 'aLtErNaTiNg CaSe', group: 'case',
    transform: (s) => s.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join(''),
  },
  inversecase: {
    label: 'InVeRsE CASE', group: 'case',
    transform: (s) => s.split('').map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(''),
  },

  'base64-encode': { label: 'Base64 Encode', group: 'encode', transform: toBase64 },
  'base64-decode': { label: 'Base64 Decode', group: 'encode', transform: fromBase64 },
  'url-encode': { label: 'URL Encode', group: 'encode', transform: (s) => encodeURIComponent(s) },
  'url-decode': { label: 'URL Decode', group: 'encode', transform: (s) => decodeURIComponent(s) },
  'html-encode': { label: 'HTML Encode', group: 'encode', transform: escapeHtml },
  'html-decode': { label: 'HTML Decode', group: 'encode', transform: decodeHtmlEntities },
  rot13: { label: 'ROT13', group: 'encode', transform: rot13 },

  md5: { label: 'MD5 Hash', group: 'hash', hash: async (s) => md5(s) },
  sha1: { label: 'SHA-1 Hash', group: 'hash', hash: (s) => sha('SHA-1', s) },
  sha256: { label: 'SHA-256 Hash', group: 'hash', hash: (s) => sha('SHA-256', s) },
  sha384: { label: 'SHA-384 Hash', group: 'hash', hash: (s) => sha('SHA-384', s) },
  sha512: { label: 'SHA-512 Hash', group: 'hash', hash: (s) => sha('SHA-512', s) },

  'text-analytics': { label: 'Text Analytics', group: 'analytics' },
};

/* --------------------------------- Component --------------------------------- */

export default function TextTransformer({ mode, title }: TextTransformerProps) {
  const def = MODE_DEFS[mode];
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<TextStats | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAnalytics = def?.group === 'analytics';
  const isHash = def?.group === 'hash';

  useEffect(() => {
    if (!def) return;
    setError('');

    if (def.group === 'analytics') {
      setStats(analyzeText(input));
      return;
    }

    if (def.group === 'hash' && def.hash) {
      setBusy(true);
      def.hash(input)
        .then((h) => { setOutput(h); setBusy(false); })
        .catch(() => { setError('Hash computation failed. Your browser may not support SubtleCrypto over this connection.'); setBusy(false); });
      return;
    }

    if (def.transform) {
      try {
        setOutput(def.transform(input));
      } catch {
        setError('Unable to process this input for the selected mode (it may be malformed, e.g. invalid Base64/URL encoding).');
        setOutput('');
      }
    }
  }, [input, mode, def]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    if (!enforceSizeLimit(raw, 1024)) {
      setError('Input too large — please keep text under 1MB for smooth in-browser processing.');
      return;
    }
    setError('');
    setInput(raw);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Clipboard access was denied by your browser.');
    }
  };

  if (!def) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-yellow-400/30">
        <p className="text-sm">⚠️ This text tool mode (<code>{mode}</code>) is not configured yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
      <h2 className="text-lg font-semibold opacity-90">{title ?? def.label}</h2>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wide opacity-60">Input Text</label>
        <textarea
          value={input}
          onChange={handleChange}
          rows={6}
          placeholder="Type or paste your text here…"
          className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-400 font-mono text-sm resize-y"
        />
        <p className="text-xs opacity-40 text-right">{input.length.toLocaleString()} characters</p>
      </div>

      {error && (
        <div className="rounded-xl p-3 bg-red-500/10 border border-red-400/30 text-sm text-red-300">
          ⚠️ {error}
        </div>
      )}

      {isAnalytics && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Characters" value={stats.characters} />
          <StatCard label="No Spaces" value={stats.charactersNoSpaces} />
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Paragraphs" value={stats.paragraphs} />
          <StatCard label="Reading Time" value={`${stats.readingTimeSec}s`} />
          <StatCard label="Byte Size" value={`${stats.byteSize} B`} />
          <div className="col-span-2 sm:col-span-4 text-xs opacity-60">
            Top characters: {stats.topChars.map((c) => `'${c.char}' (${c.count})`).join(', ') || '—'}
          </div>
        </div>
      )}

      {!isAnalytics && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wide opacity-60">
              Output {isHash && busy && '(computing…)'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-xs px-3 py-1 rounded-full bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-30 transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={isHash ? 2 : 6}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 font-mono text-sm resize-y"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl p-3 bg-white/5 border border-white/10 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide opacity-50">{label}</p>
    </div>
  );
}
