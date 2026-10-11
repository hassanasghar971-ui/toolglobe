// app/api/contact/route.ts
// Secure, rate-limited contact form handler. No database required —
// validated submissions are sanitized and relayed to an optional webhook
// (CONTACT_WEBHOOK_URL env var) or logged server-side for manual review.

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { sanitizeInput, isSuspicious } from "@/components/sanitizer";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string; // honeypot
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(ip, "contact-form", "CONTACT_FORM");
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again later.", retryAfterMs: rl.retryAfterMs },
      { status: 429 }
    );
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request format." }, { status: 400 });
  }

  // Honeypot: silently reject (but return success-shaped error to confuse bots)
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ success: false, error: "Submission rejected." }, { status: 400 });
  }

  const name = sanitizeInput(body.name, 100).trim();
  const email = sanitizeInput(body.email, 150).trim();
  const subject = sanitizeInput(body.subject, 150).trim();
  const message = sanitizeInput(body.message, 5000).trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ success: false, error: "Please provide a valid email address." }, { status: 400 });
  }

  if (name.length < 2 || message.length < 10) {
    return NextResponse.json({ success: false, error: "Message is too short to process." }, { status: 400 });
  }

  const combined = `${name} ${email} ${subject} ${message}`;
  if (isSuspicious(combined)) {
    return NextResponse.json({ success: false, error: "Submission blocked by security filter." }, { status: 400 });
  }

  const submission = {
    name,
    email,
    subject,
    message,
    ip,
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  try {
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } else {
      // Fallback: structured server log for manual review when no webhook is configured.
      // eslint-disable-next-line no-console
      console.log("[ToolGlobe Contact Submission]", JSON.stringify(submission));
    }
  } catch {
    // Non-fatal: the submission was validated successfully even if relay fails.
    // eslint-disable-next-line no-console
    console.error("[ToolGlobe Contact] Failed to relay submission to webhook.");
  }

  return NextResponse.json({ success: true });
}
