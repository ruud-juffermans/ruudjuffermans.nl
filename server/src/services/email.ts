import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../lib/config.js";
import { logger } from "../lib/logger.js";

// Build a transport from the SMTP_* config. When SMTP_HOST is empty (typical in
// local dev) we fall back to logging the message to the server console so the
// contact flow can be exercised without a real mail server.

let cachedTransport: Transporter | null = null;

function getTransport(): Transporter | null {
  if (cachedTransport) return cachedTransport;
  if (!config.SMTP_HOST) return null;

  cachedTransport = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth:
      config.SMTP_USER && config.SMTP_PASS
        ? { user: config.SMTP_USER, pass: config.SMTP_PASS }
        : undefined,
  });
  return cachedTransport;
}

interface ContactEmail {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmail): Promise<void> {
  const subject = `Nieuw contactbericht van ${data.name}${data.company ? ` (${data.company})` : ""}`;
  const text = [
    `Naam: ${data.name}`,
    `E-mail: ${data.email}`,
    data.company ? `Bedrijf: ${data.company}` : null,
    `\nBericht:\n${data.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const transport = getTransport();
  if (!transport) {
    // Dev fallback: surface the message on the console instead of sending.
    logger.info({ subject, text }, "Email sending skipped (no SMTP_HOST configured)");
    return;
  }

  await transport.sendMail({
    from: config.MAIL_FROM,
    to: config.CONTACT_EMAIL,
    replyTo: data.email,
    subject,
    text,
  });

  logger.info({ name: data.name, email: data.email }, "Contact email sent");
}
