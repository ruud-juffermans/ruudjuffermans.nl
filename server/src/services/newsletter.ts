import { config } from "../lib/config.js";
import { logger } from "../lib/logger.js";

export async function subscribeToNewsletter(email: string): Promise<void> {
  if (config.NEWSLETTER_API_KEY === "placeholder") {
    logger.info({ email }, "Newsletter signup skipped (no API key configured)");
    return;
  }

  // Buttondown API integration
  const response = await fetch("https://api.buttondown.email/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${config.NEWSLETTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error({ email, status: response.status, body }, "Newsletter signup failed");
    throw new Error("Newsletter signup failed");
  }

  logger.info({ email }, "Newsletter subscriber added");
}
