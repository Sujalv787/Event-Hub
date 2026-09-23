import { Response, NextFunction, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../models/User";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized("Please login to continue");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }

    next();
  };
}
