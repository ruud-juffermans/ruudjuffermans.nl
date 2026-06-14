import { Resend } from "resend";
import { config } from "../lib/config.js";
import { logger } from "../lib/logger.js";

const resend = new Resend(config.RESEND_API_KEY);

interface ContactEmail {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmail): Promise<void> {
  if (config.RESEND_API_KEY === "re_placeholder") {
    logger.info({ data }, "Email sending skipped (no API key configured)");
    return;
  }

  await resend.emails.send({
    from: "Website <noreply@ruudjuf.nl>",
    to: config.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `Nieuw contactbericht van ${data.name}${data.company ? ` (${data.company})` : ""}`,
    text: [
      `Naam: ${data.name}`,
      `E-mail: ${data.email}`,
      data.company ? `Bedrijf: ${data.company}` : null,
      `\nBericht:\n${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  logger.info({ name: data.name, email: data.email }, "Contact email sent");
}
