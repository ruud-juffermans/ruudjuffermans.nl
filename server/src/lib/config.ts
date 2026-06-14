import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().default("re_placeholder"),
  CONTACT_EMAIL: z.string().email().default("ruudjuffermans@pm.me"),
  NEWSLETTER_API_KEY: z.string().default("placeholder"),
});

export const config = envSchema.parse(process.env);
