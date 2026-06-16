import rateLimit from "express-rate-limit";

// Limit abuse of the public form endpoints (they send email).
export const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // max submissions per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Te veel verzoeken. Probeer het later opnieuw.",
  },
});

// Looser limit for analytics — normal browsing must not hit the form cap.
export const analyticsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // max page-view beacons per IP per minute
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Te veel verzoeken. Probeer het later opnieuw.",
  },
});
