import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validation.js";
import { subscribeToNewsletter } from "../services/newsletter.js";

const router = Router();

const newsletterSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
});

router.post("/", validate(newsletterSchema), async (req, res, next) => {
  try {
    await subscribeToNewsletter(req.body.email);
    res.json({
      success: true,
      message: "Je bent ingeschreven voor de nieuwsbrief!",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
