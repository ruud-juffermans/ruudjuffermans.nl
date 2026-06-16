import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validation.js";
import { prisma } from "../lib/db.js";

const router = Router();

const pageViewSchema = z.object({
  path: z.string().min(1).max(512),
  locale: z.string().max(16).optional(),
  referrer: z.string().max(1024).optional(),
});

// Record a page view. Fire-and-forget from the client.
router.post("/", validate(pageViewSchema), async (req, res, next) => {
  try {
    await prisma.pageView.create({ data: req.body });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Aggregate view count for a given path (handy for "X views" badges later).
router.get("/views", async (req, res, next) => {
  try {
    const path = typeof req.query.path === "string" ? req.query.path : undefined;
    const count = await prisma.pageView.count({
      where: path ? { path } : undefined,
    });
    res.json({ path: path ?? null, count });
  } catch (error) {
    next(error);
  }
});

export default router;
