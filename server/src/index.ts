import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./lib/config.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { formRateLimit, analyticsRateLimit } from "./middleware/rateLimit.js";
import contactRouter from "./routes/contact.js";
import newsletterRouter from "./routes/newsletter.js";
import analyticsRouter from "./routes/analytics.js";

const app = express();

// Trust the reverse proxy in production so rate limiting sees the real client IP.
if (config.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/contact", formRateLimit, contactRouter);
app.use("/api/v1/newsletter", formRateLimit, newsletterRouter);
app.use("/api/v1/analytics", analyticsRateLimit, analyticsRouter);

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT} [${config.NODE_ENV}]`);
});
