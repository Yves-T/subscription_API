import User from "@models/user.model";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { NextFunction, Request, Response } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, data: users });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(new NotFoundError("User not found"));
  }
  res.status(200).json({ success: true, data: user });
};
