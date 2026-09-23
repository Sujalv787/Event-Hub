import { Response, NextFunction, Request } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/User";

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Please login to continue");
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw ApiError.unauthorized("Session expired, please login again");
    }

    const user = await User.findById(payload.id);
    if (!user) {
      throw ApiError.unauthorized("User no longer exists");
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  }
);
