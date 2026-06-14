import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "./errorHandler.js";

export function validate(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      throw new AppError(400, message);
    }
    req.body = result.data;
    next();
  };
}
