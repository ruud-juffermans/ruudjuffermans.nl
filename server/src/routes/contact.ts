import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validation.js";
import { sendContactEmail } from "../services/email.js";
import { prisma } from "../lib/db.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  company: z.string().optional(),
  message: z.string().min(10, "Bericht moet minimaal 10 tekens bevatten"),
});

router.post("/", validate(contactSchema), async (req, res, next) => {
  try {
    // Persist first so the submission survives even if the email send fails.
    await prisma.contactSubmission.create({ data: req.body });
    await sendContactEmail(req.body);
    res.json({
      success: true,
      message: "Bericht succesvol verzonden. Ik neem zo snel mogelijk contact op.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
