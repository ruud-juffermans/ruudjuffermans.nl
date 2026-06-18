import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().url(),
  // SMTP (e.g. Proton Mail). Leave SMTP_HOST empty to print emails to the
  // server console instead of sending them — see services/email.ts.
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  MAIL_FROM: z.string().default("Website <noreply@ruudjuf.nl>"),
  CONTACT_EMAIL: z.string().email().default("ruudjuffermans@pm.me"),
  NEWSLETTER_API_KEY: z.string().default("placeholder"),
  // Shared secret the central admin app (ruudjuffermans-infra) presents in the
  // X-Service-Token header to reach /api/v1/admin/*. Empty disables the admin API.
  ADMIN_SERVICE_TOKEN: z.string().default(""),
});

export const config = envSchema.parse(process.env);
