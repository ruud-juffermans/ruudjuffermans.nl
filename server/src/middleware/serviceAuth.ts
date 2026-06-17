import type { Request, Response, NextFunction } from "express";
import { config } from "../lib/config.js";
import { AppError } from "./errorHandler.js";

// The admin API is consumed only by the central admin app (ruudjuffermans-infra),
// machine-to-machine. There is no user/session concept on this site, so access is
// gated by a single shared secret sent in the X-Service-Token header and compared
// against ADMIN_SERVICE_TOKEN.
//
// Fail closed: if ADMIN_SERVICE_TOKEN is unset/empty, the admin API is disabled
// entirely (every request is rejected) so a misconfigured deploy never exposes it.
export function requireServiceToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const expected = config.ADMIN_SERVICE_TOKEN.trim();
  if (!expected) {
    throw new AppError(503, "Admin API is not configured.");
  }
  const provided = req.header("x-service-token")?.trim();
  if (!provided || provided !== expected) {
    throw new AppError(401, "Invalid service token.");
  }
  next();
}
