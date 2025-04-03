import User from "@models/user.model";
import { UnAuthorizedError } from "@shared/errors/UnAuthorizedError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new UnAuthorizedError("Unauthorized"));
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById((<any>decoded).userId);
    if (!user) {
      return next(new UnAuthorizedError("Unauthorized"));
    }
    req.user = user._id.toString();
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Unauthorized", error: error?.message });
  }
};

export default authorize;
