import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db.js";
import { AppError } from "../middleware/errorHandler.js";

// Admin API for the central admin app. Mounted behind requireServiceToken in
// index.ts, so every handler can assume the caller is the trusted admin service.
// Read + write management of the three data sets this site collects: contact
// submissions, newsletter subscribers, and page-view analytics.
const router = Router();

// Clamp how far back analytics/listing queries look and how many rows return,
// so a stray query can never scan or return the whole table unbounded.
const daysQuery = z.coerce.number().int().min(1).max(365).default(30);
const limitQuery = z.coerce.number().int().min(1).max(500).default(100);

function cutoff(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

// ─── Contact submissions ───────────────────────────────────────────────────

const contactStatus = z.enum(["new", "responded", "archived"]);

// GET /contact?status=&limit= — list submissions, newest first.
router.get("/contact", async (req, res, next) => {
  try {
    const { status, limit } = z
      .object({ status: contactStatus.optional(), limit: limitQuery })
      .parse(req.query);
    const submissions = await prisma.contactSubmission.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    res.json({ submissions });
  } catch (error) {
    next(error);
  }
});

// GET /contact/stats — counts per status for the dashboard.
router.get("/contact/stats", async (_req, res, next) => {
  try {
    const grouped = await prisma.contactSubmission.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const counts = { new: 0, responded: 0, archived: 0 };
    for (const row of grouped) counts[row.status] = row._count._all;
    res.json({ counts, total: counts.new + counts.responded + counts.archived });
  } catch (error) {
    next(error);
  }
});

// PATCH /contact/:id/status — move a submission between new/responded/archived.
router.patch("/contact/:id/status", async (req, res, next) => {
  try {
    const { status } = z.object({ status: contactStatus }).parse(req.body);
    const submission = await prisma.contactSubmission
      .update({ where: { id: req.params.id }, data: { status } })
      .catch(() => {
        throw new AppError(404, "Submission not found.");
      });
    res.json({ submission });
  } catch (error) {
    next(error);
  }
});

// DELETE /contact/:id — permanently remove a submission.
router.delete("/contact/:id", async (req, res, next) => {
  try {
    await prisma.contactSubmission
      .delete({ where: { id: req.params.id } })
      .catch(() => {
        throw new AppError(404, "Submission not found.");
      });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// ─── Newsletter subscribers ────────────────────────────────────────────────

// GET /newsletter?active=&limit= — list subscribers, newest first.
router.get("/newsletter", async (req, res, next) => {
  try {
    const { active, limit } = z
      .object({
        active: z
          .enum(["true", "false"])
          .transform((v) => v === "true")
          .optional(),
        limit: limitQuery,
      })
      .parse(req.query);
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: active === undefined ? {} : { active },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    res.json({ subscribers });
  } catch (error) {
    next(error);
  }
});

// GET /newsletter/stats — totals + source breakdown for the dashboard.
router.get("/newsletter/stats", async (_req, res, next) => {
  try {
    const [total, active, bySource] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.newsletterSubscriber.groupBy({
        by: ["source"],
        _count: { _all: true },
      }),
    ]);
    res.json({
      total,
      active,
      unsubscribed: total - active,
      bySource: bySource.map((r) => ({ source: r.source, count: r._count._all })),
    });
  } catch (error) {
    next(error);
  }
});

// POST /newsletter/:id/unsubscribe — mark inactive (keeps the row for history).
router.post("/newsletter/:id/unsubscribe", async (req, res, next) => {
  try {
    const subscriber = await prisma.newsletterSubscriber
      .update({
        where: { id: req.params.id },
        data: { active: false, unsubscribedAt: new Date() },
      })
      .catch(() => {
        throw new AppError(404, "Subscriber not found.");
      });
    res.json({ subscriber });
  } catch (error) {
    next(error);
  }
});

// DELETE /newsletter/:id — permanently remove a subscriber.
router.delete("/newsletter/:id", async (req, res, next) => {
  try {
    await prisma.newsletterSubscriber
      .delete({ where: { id: req.params.id } })
      .catch(() => {
        throw new AppError(404, "Subscriber not found.");
      });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// ─── Page-view analytics ───────────────────────────────────────────────────

// GET /analytics/overview?days= — headline totals over the window.
router.get("/analytics/overview", async (req, res, next) => {
  try {
    const { days } = z.object({ days: daysQuery }).parse(req.query);
    const since = cutoff(days);
    const [totalViews, byLocale] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      prisma.pageView.groupBy({
        by: ["locale"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),
    ]);
    res.json({
      days,
      totalViews,
      byLocale: byLocale.map((r) => ({
        locale: r.locale ?? "unknown",
        count: r._count._all,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /analytics/top-pages?days=&limit= — most visited paths.
router.get("/analytics/top-pages", async (req, res, next) => {
  try {
    const { days, limit } = z
      .object({ days: daysQuery, limit: limitQuery })
      .parse(req.query);
    const grouped = await prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: cutoff(days) } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: limit,
    });
    res.json({
      pages: grouped.map((r) => ({ path: r.path, count: r._count._all })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /analytics/top-referrers?days=&limit= — where traffic comes from.
router.get("/analytics/top-referrers", async (req, res, next) => {
  try {
    const { days, limit } = z
      .object({ days: daysQuery, limit: limitQuery })
      .parse(req.query);
    const grouped = await prisma.pageView.groupBy({
      by: ["referrer"],
      where: { createdAt: { gte: cutoff(days) } },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: limit,
    });
    res.json({
      referrers: grouped.map((r) => ({
        referrer: r.referrer ?? "direct",
        count: r._count._all,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /analytics/timeseries?days= — page views per day for charting.
router.get("/analytics/timeseries", async (req, res, next) => {
  try {
    const { days } = z.object({ days: daysQuery }).parse(req.query);
    // date_trunc gives one bucket per day; Prisma groupBy can't truncate, so use
    // a parameterized raw query. Returns rows oldest→newest.
    const rows = await prisma.$queryRaw<Array<{ day: Date; count: bigint }>>(
      Prisma.sql`
        SELECT date_trunc('day', created_at) AS day, COUNT(*)::bigint AS count
        FROM page_views
        WHERE created_at >= ${cutoff(days)}
        GROUP BY day
        ORDER BY day ASC
      `,
    );
    res.json({
      series: rows.map((r) => ({
        day: r.day.toISOString().slice(0, 10),
        count: Number(r.count),
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
