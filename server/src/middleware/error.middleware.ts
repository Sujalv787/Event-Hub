import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err && typeof err === "object" && "name" in err) {
    const mongooseErr = err as { name: string; code?: number };

    if (mongooseErr.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    if (mongooseErr.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "This email is already registered" });
    }

    if (mongooseErr.name === "ValidationError") {
      const messages = Object.values(
        (err as unknown as { errors: Record<string, { message: string }> }).errors
      ).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong, please try again later",
  });
}
