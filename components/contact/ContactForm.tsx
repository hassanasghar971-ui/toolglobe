"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { sanitizePlainText } from "@/lib/security/sanitize";
import { OWNER_CONTACT_EMAIL } from "@/lib/constants/site";

const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 2000;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = sanitizePlainText(name).slice(0, MAX_NAME_LENGTH);
    const cleanSubject = sanitizePlainText(subject).slice(0, MAX_SUBJECT_LENGTH);
    const cleanMessage = sanitizePlainText(message).slice(0, MAX_MESSAGE_LENGTH);

    if (!cleanName || !cleanSubject || !cleanMessage) {
      setError("Please fill in your name, subject, and message before continuing.");
      return;
    }

    setError(null);

    const mailSubject = encodeURIComponent(`[ToolGlobe Contact] ${cleanSubject}`);
    const mailBody = encodeURIComponent(
      `Name: ${cleanName}\n\n${cleanMessage}`
    );

    window.location.href = `mailto:${OWNER_CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium text-slate-800">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-sm font-medium text-slate-800">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          maxLength={MAX_SUBJECT_LENGTH}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-slate-800">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={6}
          value={message}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
      >
        <Send className="h-4 w-4" />
        Open in Email App
      </button>

      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <Mail className="h-3.5 w-3.5" />
        This opens your default email application addressed to{" "}
        {OWNER_CONTACT_EMAIL}. No data is sent to or stored on our servers.
      </p>
    </form>
  );
}
