// app/contact/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and try again.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-white/50 text-sm">
          Found a calculation error? Have a feature request or business inquiry? Send us a message
          and we&apos;ll respond as soon as possible. You can also review our{" "}
          <Link href="/about" className="text-indigo-300 underline">About page</Link>, our{" "}
          <Link href="/legal/privacy" className="text-indigo-300 underline">Privacy Policy</Link>, or email{" "}
          <a href={`mailto:${SITE_CONFIG.legal.privacyEmail}`} className="text-indigo-300 underline">
            {SITE_CONFIG.legal.privacyEmail}
          </a>{" "}
          directly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 flex flex-col gap-5">
        {/* Honeypot field — hidden from real users, trips up basic bots */}
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40 uppercase tracking-wide" htmlFor="name">Name</label>
            <input
              id="name"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="glass-card px-4 py-3 bg-transparent text-white outline-none"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/40 uppercase tracking-wide" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              maxLength={150}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="glass-card px-4 py-3 bg-transparent text-white outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 uppercase tracking-wide" htmlFor="subject">Subject</label>
          <input
            id="subject"
            required
            maxLength={150}
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className="glass-card px-4 py-3 bg-transparent text-white outline-none"
            placeholder="How can we help?"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 uppercase tracking-wide" htmlFor="message">Message</label>
          <textarea
            id="message"
            required
            rows={6}
            maxLength={5000}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className="glass-card px-4 py-3 bg-transparent text-white outline-none resize-y"
            placeholder="Tell us more…"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="glow-border rounded-xl px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>

        {status === "success" && (
          <p className="text-sm text-emerald-300 bg-emerald-500/10 rounded-xl px-4 py-3">
            ✅ Thank you! Your message has been received — we&apos;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-300 bg-red-500/10 rounded-xl px-4 py-3">⚠️ {errorMsg}</p>
        )}
      </form>
    </div>
  );
}
